<?php

namespace App\Http\Controllers;

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
     | Response Helpers
     * ------------------------------------------------------------------ */
    
    private function success($data, string $message = null, int $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message ?? 'Operation completed successfully',
            'data' => $data,
        ], $status);
    }

    private function failure(string $message, int $status = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $status);
    }

    /* ------------------------------------------------------------------
     | Auth Helpers
     * ------------------------------------------------------------------ */

    private function getAuthenticatedTaxpayer(): ?Taxpayer
    {
        $user = Auth::user();
        
        if (!$user || !$user->taxpayer_id) {
            return null;
        }

        return Taxpayer::with(['products'])->find($user->taxpayer_id);
    }

    /* ------------------------------------------------------------------
     | Product Catalogue Actions
     * ------------------------------------------------------------------ */

    /**
     * Display taxpayer's product catalogue page
     */
    /**
     * Display taxpayer's product catalogue page
     */
    public function index()
    {
        $taxpayer = $this->getAuthenticatedTaxpayer();
        
        if (!$taxpayer) {
            return redirect()->route('taxpayer.dashboard')
                ->withErrors(['error' => 'Your account is not linked to a taxpayer record. Please contact support.']);
        }

        $myProducts = $this->formatTaxpayerProducts($taxpayer);
        
        return Inertia::render('taxpayer/products/index', [
            'myProducts' => $myProducts,
        ]);
    }

    /**
     * Show form to add new product
     */
    public function create()
    {
        $taxpayer = $this->getAuthenticatedTaxpayer();
        
        if (!$taxpayer) {
            return redirect()->route('login');
        }

        $availableProducts = $this->getAvailableProducts($taxpayer);

        return Inertia::render('taxpayer/products/create', [
            'availableProducts' => $availableProducts,
        ]);
    }

    /**
     * Add a product to taxpayer's catalogue
     */
    public function store(Request $request)
    {
        $taxpayer = $this->getAuthenticatedTaxpayer();
        
        if (!$taxpayer) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'health_certificate_number' => 'nullable|string|max:255',
            'health_certificate_expiry' => 'nullable|date',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check if already attached
        if ($taxpayer->products()->where('product_id', $validated['product_id'])->exists()) {
            return back()->withErrors(['error' => 'Product already in your catalogue']);
        }

        // Check if product is active
        $product = Product::where('is_active', true)->find($validated['product_id']);
        if (!$product) {
            return back()->withErrors(['error' => 'Product not available']);
        }

        $taxpayer->products()->attach($validated['product_id'], [
            'registration_date' => now()->toDateString(),
            'status' => 'active',
            'health_certificate_number' => $validated['health_certificate_number'] ?? null,
            'health_certificate_expiry' => $validated['health_certificate_expiry'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Product added to your catalogue successfully');
    }

    /**
     * Update a product in taxpayer's catalogue
     */
    public function update(Request $request, int $productId)
    {
        $taxpayer = $this->getAuthenticatedTaxpayer();
        
        if (!$taxpayer) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        // Check if product exists in catalogue
        if (!$taxpayer->products()->where('product_id', $productId)->exists()) {
            return back()->withErrors(['error' => 'Product not in your catalogue']);
        }

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
        $taxpayer = $this->getAuthenticatedTaxpayer();
        
        if (!$taxpayer) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

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
        return $taxpayer->products->map(function ($product) {
            return [
                'id' => $product->id,
                'code' => $product->code,
                'name' => $product->name,
                'category' => $product->category,
                'unit_type' => $product->unit_type,
                'requires_health_certificate' => $product->requires_health_certificate,
                'registration_date' => $product->pivot->registration_date,
                'status' => $product->pivot->status,
                'health_certificate_number' => $product->pivot->health_certificate_number,
                'health_certificate_expiry' => $product->pivot->health_certificate_expiry,
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
            ->select('id', 'code', 'name', 'category', 'unit_type', 'requires_health_certificate')
            ->orderBy('name')
            ->get()
            ->toArray();
    }
}
