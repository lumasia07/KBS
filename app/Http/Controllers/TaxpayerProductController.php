<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Taxpayer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Throwable;

/**
 * TaxpayerProductController
 * 
 * Handles taxpayer self-service product catalogue management.
 * Modular controller - separate from TaxpayerController for better maintainability.
 */
class TaxpayerProductController extends Controller
{
    /* ------------------------------------------------------------------
     | Product Catalogue Actions
     * ------------------------------------------------------------------ */

    /**
     * Display taxpayer's product catalogue page
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->taxpayer) {
            return redirect()->route('taxpayer.dashboard')
                ->withErrors(['error' => 'Your account is not linked to a taxpayer record. Please contact support.']);
        }

        $myProducts = $this->formatTaxpayerProducts($user->taxpayer);

        return Inertia::render('taxpayer/products/index', [
            'myProducts' => $myProducts,
        ]);
    }

    /**
     * Show form to add new product
     */
    public function create()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $availableProducts = $this->getAvailableProducts($user->taxpayer);

        // Get categories from the Category model
        $categories = Category::all()->pluck('name', 'id')->toArray();

        return Inertia::render('taxpayer/products/create', [
            'availableProducts' => $availableProducts,
            'categories' => $categories,
        ]);
    }

    /**
     * Add a product to taxpayer's catalogue
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $taxpayer = $user->taxpayer;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'unit_type' => 'required|string|in:unit,pack,carton,liter,kilogram,other',
            'description' => 'nullable|string|max:1000',
            'certificate' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // Max 5MB
            'health_certificate_number' => 'nullable|string|max:255',
            'health_certificate_expiry' => 'nullable|date',
            'notes' => 'nullable|string|max:500',
        ]);

        // auto-generate product code
        $productCode = 'PROD-' . strtoupper(uniqid());

        // Create the product (inactive by default, pending approval)
        $product = Product::create([
            'code' => $productCode,
            'name' => $validated['name'],
            'category_id' => $validated['category_id'], 
            'unit_type' => $validated['unit_type'],
            // Price is now determined by Admin
            'stamp_price_per_unit' => null,
            'description' => $validated['description'] ?? null,
            'requires_health_certificate' => true,
            'is_active' => false,
        ]);

        // Handle file upload
        $certificatePath = null;
        if ($request->hasFile('certificate')) {
            $certificatePath = $request->file('certificate')->store('certificates', 'public');
        }

        // Attach to taxpayer with pending status
        $taxpayer->products()->attach($product->id, [
            'registration_date' => now()->toDateString(),
            'status' => 'pending',
            'health_certificate_number' => $validated['health_certificate_number'] ?? null,
            'health_certificate_expiry' => $validated['health_certificate_expiry'] ?? null,
            'certificate_path' => $certificatePath,
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('taxpayer.products.index')->with('success', 'Product request submitted for approval.');
    }

    /**
     * Update a product in taxpayer's catalogue
     */
    public function update(Request $request, int $productId)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $taxpayer = $user->taxpayer;

        // Check if product exists in catalogue
        $validated = $request->validate([
            'health_certificate_number' => 'nullable|string|max:255',
            'health_certificate_expiry' => 'nullable|date',
            'notes' => 'nullable|string|max:500',
            'status' => 'nullable|in:active,inactive',
        ]);

        $updateData = array_filter([
            'health_certificate_number' => $validated['health_certificate_number'] ?? null,
            'health_certificate_expiry' => $validated['health_certificate_expiry'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => $validated['status'] ?? null,
        ], fn($v) => !is_null($v));

        if (!empty($updateData)) {
            $taxpayer->products()->updateExistingPivot($productId, $updateData);
        }

        return back()->with('success', 'Product updated successfully');
    }

    /**
     * Remove a product from taxpayer's catalogue
     */
    public function destroy(int $productId)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $taxpayer = $user->taxpayer;

        // Check if product exists in catalogue
        if (!$taxpayer->products()->where('product_id', $productId)->exists()) {
            return back()->withErrors(['error' => 'Product not in your catalogue']);
        }

        $taxpayer->products()->detach($productId);

        return back()->with('success', 'Product removed from your catalogue');
    }

    /* ------------------------------------------------------------------
     | Data Formatting Helpers
     * ------------------------------------------------------------------ */

    /**
     * Format taxpayer's products for frontend
     */
    private function formatTaxpayerProducts(Taxpayer $taxpayer): array
    {
        return $taxpayer->products()
            ->with('category')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'code' => $product->code,
                    'name' => $product->name,
                    'category' => $product->category?->name ?? 'Uncategorized',
                    'unit_type' => $product->unit_type,
                    'requires_health_certificate' => $product->requires_health_certificate,
                    'registration_date' => $product->pivot->registration_date,
                    'status' => $product->pivot->status,
                    'health_certificate_number' => $product->pivot->health_certificate_number,
                    'health_certificate_expiry' => $product->pivot->health_certificate_expiry,
                    'certificate_path' => $product->pivot->certificate_path ? asset('storage/' . $product->pivot->certificate_path) : null,
                    'rejection_reason' => $product->pivot->rejection_reason,
                    'notes' => $product->pivot->notes,
                ];
            })->toArray();
    }

    /**
     * Get products not yet in taxpayer's catalogue
     */
    private function getAvailableProducts(Taxpayer $taxpayer): array
    {
        $existingProductIds = $taxpayer->products->pluck('id')->toArray();

        return Product::where('is_active', true)
            ->whereNotIn('id', $existingProductIds)
            ->with('category')
            ->orderBy('name')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'code' => $product->code,
                    'name' => $product->name,
                    'category' => $product->category?->name ?? 'Uncategorized',
                    'unit_type' => $product->unit_type,
                    'requires_health_certificate' => $product->requires_health_certificate,
                ];
            })
            ->toArray();
    }
}