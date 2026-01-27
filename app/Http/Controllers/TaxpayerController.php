<?php

namespace App\Http\Controllers;

use App\Http\Requests\Taxpayer\StoreRequest;
use App\Http\Requests\Taxpayer\UpdateRequest;
use App\Models\Product;
use App\Models\Taxpayer;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Throwable;
use App\Models\BusinessSector;
use App\Models\Commune;
use App\Models\CompanySize;
use App\Models\District;
use App\Models\LegalForm;
use App\Models\Quartier;

class TaxpayerController extends Controller
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
            'count' => is_countable($data) ? count($data) : 1,
        ], $status);
    }

    private function failure(Throwable $e, string $customMessage = null, int $status = 500)
    {
        return response()->json([
            'success' => false,
            'message' => $customMessage ?? 'An error occurred while processing your request',
            'error' => config('app.debug') ? $e->getMessage() : null,
        ], $status);
    }

    private function notFound(string $resource = 'Taxpayer')
    {
        return response()->json([
            'success' => false,
            'message' => $resource . ' not found',
        ], 404);
    }

    /* ------------------------------------------------------------------
     | CRUD Operations
     * ------------------------------------------------------------------ */

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Implement as needed
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('TaxpayerRegistration', [
            'legalForms' => LegalForm::select('id', 'name', 'code')->get(),
            'sectors' => BusinessSector::select('id', 'name')->get(),
            'companySizes' => CompanySize::select('id', 'name')->get(),
            'districts' => District::select('id', 'name')->get(),
            'communes' => Commune::select('id', 'name', 'district_id')->get(),
            'quartiers' => Quartier::select('id', 'name', 'commune_id')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        DB::beginTransaction();

        try {
            $validatedData = $request->validated();

            // Generate API credentials
            $validatedData['api_key'] = $this->generateApiKey();
            $validatedData['api_key_expires_at'] = now()->addYear();

            // Create taxpayer
            $taxpayer = Taxpayer::create($validatedData);

            // Attach products if provided
            if ($request->filled('products')) {
                $this->attachProductsToTaxpayer($taxpayer, $request->products);
            }

            DB::commit();

            // Load relationships
            $taxpayer = $this->loadTaxpayerRelationships($taxpayer);

            // return $this->success([
            //     'taxpayer' => $taxpayer,
            //     'api_key' => $taxpayer->api_key // Show only once on creation
            // ], 'Taxpayer created successfully', 201);

            return redirect()->route('home')->with('success', 'Taxpayer created successfully. Please wait for verification.');

        } catch (Throwable $e) {
            DB::rollBack();
            return $this->failure($e, 'Failed to create taxpayer');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $taxpayer = Taxpayer::findOrFail($id);
            $taxpayer = $this->loadTaxpayerRelationships($taxpayer);

            return $this->success($taxpayer);
        } catch (ModelNotFoundException $e) {
            return $this->notFound();
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to fetch taxpayer');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Implement as needed
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, string $id)
    {
        DB::beginTransaction();

        try {
            $taxpayer = Taxpayer::findOrFail($id);
            $validatedData = $request->validated();

            // Handle status change
            if ($this->shouldHandleStatusChange($taxpayer, $validatedData)) {
                $validatedData = $this->processStatusChange($taxpayer, $validatedData);
            }

            // // Handle API key regeneration
            // if ($request->boolean('regenerate_api_key') && Auth::user()->can('regenerate-api-key')) {
            //     $validatedData = $this->regenerateApiKeyForTaxpayer($taxpayer, $validatedData);
            // }

            // Update taxpayer
            $taxpayer->update($validatedData);

            // Handle products update
            if ($request->filled('products')) {
                $this->updateTaxpayerProducts($taxpayer, $request->products);
            }

            DB::commit();

            $taxpayer->refresh();
            $taxpayer = $this->loadTaxpayerRelationships($taxpayer, true);

            return $this->success($taxpayer, 'Taxpayer updated successfully');

        } catch (ModelNotFoundException $e) {
            return $this->notFound();
        } catch (Throwable $e) {
            DB::rollBack();
            return $this->failure($e, 'Failed to update taxpayer');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();

        try {
            $taxpayer = Taxpayer::findOrFail($id);
            $taxpayer->delete();

            DB::commit();

            return $this->success(null, 'Taxpayer deleted successfully');
        } catch (ModelNotFoundException $e) {
            return $this->notFound();
        } catch (Throwable $e) {
            DB::rollBack();
            return $this->failure($e, 'Failed to delete taxpayer');
        }
    }

    /* ------------------------------------------------------------------
     | Special Actions
     * ------------------------------------------------------------------ */

    /**
     * Verify a taxpayer
     */
    public function verify(string $id)
    {
        try {
            $taxpayer = Taxpayer::findOrFail($id);

            $taxpayer->update([
                'registration_status' => 'verified',
                'verification_date' => now()->toDateString(),
                'verified_by' => Auth::id(),
            ]);

            return $this->success($taxpayer, 'Taxpayer verified successfully');
        } catch (ModelNotFoundException $e) {
            return $this->notFound();
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to verify taxpayer');
        }
    }

    /**
     * Reject a taxpayer
     */
    public function reject(Request $request, string $id)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        try {
            $taxpayer = Taxpayer::findOrFail($id);

            $taxpayer->update([
                'registration_status' => 'rejected',
                'rejection_reason' => $request->rejection_reason,
            ]);

            return $this->success($taxpayer, 'Taxpayer rejected successfully');
        } catch (ModelNotFoundException $e) {
            return $this->notFound();
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to reject taxpayer');
        }
    }

    /**
     * Regenerate API key
     */
    public function regenerateApiKey(string $id)
    {
        try {
            $taxpayer = Taxpayer::findOrFail($id);

            $newApiKey = $this->generateApiKey();

            $taxpayer->update([
                'api_key' => $newApiKey,
                'api_key_expires_at' => now()->addYear(),
            ]);

            return $this->success([
                'api_key' => $newApiKey,
                'api_key_expires_at' => $taxpayer->api_key_expires_at,
            ], 'API key regenerated successfully');
        } catch (ModelNotFoundException $e) {
            return $this->notFound();
        } catch (Throwable $e) {
            return $this->failure($e, 'Failed to regenerate API key');
        }
    }

    /* ------------------------------------------------------------------
     | Helper Methods
     * ------------------------------------------------------------------ */

    /**
     * Generate a secure API key
     */
    private function generateApiKey(): string
    {
        return Str::random(64);
    }

    /**
     * Load taxpayer relationships
     */
    private function loadTaxpayerRelationships(Taxpayer $taxpayer, bool $withVerifierAndProducts = false): Taxpayer
    {
        $relations = [
            'legalForm',
            'sector',
            'companySize',
            'district',
            'commune',
            'quartier'
        ];

        if ($withVerifierAndProducts) {
            $relations[] = 'verifier';
            $relations[] = 'products';
        }

        return $taxpayer->load($relations);
    }

    /**
     * Check if status change should be handled
     */
    private function shouldHandleStatusChange(Taxpayer $taxpayer, array $validatedData): bool
    {
        return isset($validatedData['registration_status']) &&
            $validatedData['registration_status'] !== $taxpayer->registration_status;
    }

    /**
     * Process status change
     */
    private function processStatusChange(Taxpayer $taxpayer, array $validatedData): array
    {
        if ($validatedData['registration_status'] === 'verified') {
            $validatedData['verification_date'] = now()->toDateString();
            $validatedData['verified_by'] = Auth::id();
        }

        // Clear verification data if moving away from verified status
        if (
            $taxpayer->registration_status === 'verified' &&
            $validatedData['registration_status'] !== 'verified'
        ) {
            $validatedData['verification_date'] = null;
            $validatedData['verified_by'] = null;
        }

        return $validatedData;
    }

    /**
     * Regenerate API key for taxpayer
     */
    private function regenerateApiKeyForTaxpayer(Taxpayer $taxpayer, array $validatedData): array
    {
        $validatedData['api_key'] = $this->generateApiKey();
        $validatedData['api_key_expires_at'] = now()->addYear();
        return $validatedData;
    }

    /**
     * Attach products to taxpayer
     */
    private function attachProductsToTaxpayer(Taxpayer $taxpayer, array $products): void
    {
        $productData = [];

        foreach ($products as $product) {
            // Validate product exists and is active
            $productModel = Product::active()->find($product['product_id']);

            if (!$productModel) {
                continue;
            }

            $productData[$product['product_id']] = [
                'registration_date' => $product['registration_date'],
                'status' => 'active',
                'health_certificate_number' => $product['health_certificate_number'] ?? null,
                'health_certificate_expiry' => $product['health_certificate_expiry'] ?? null,
                'notes' => $product['notes'] ?? null,
            ];
        }

        if (!empty($productData)) {
            $taxpayer->products()->attach($productData);
        }
    }

    /**
     * Update taxpayer products based on actions
     */
    private function updateTaxpayerProducts(Taxpayer $taxpayer, array $products): void
    {
        foreach ($products as $product) {
            $productId = $product['product_id'];
            $action = $product['action'];

            switch ($action) {
                case 'attach':
                    $this->attachProduct($taxpayer, $product);
                    break;

                case 'detach':
                    $taxpayer->products()->detach($productId);
                    break;

                case 'update':
                    $this->updateProductPivot($taxpayer, $productId, $product);
                    break;
            }
        }
    }

    /**
     * Attach a single product
     */
    private function attachProduct(Taxpayer $taxpayer, array $product): void
    {
        $productId = $product['product_id'];

        // Check if product is active and not already attached
        $productModel = Product::active()->find($productId);

        if (!$productModel || $taxpayer->products()->where('product_id', $productId)->exists()) {
            return;
        }

        $taxpayer->products()->attach($productId, [
            'registration_date' => $product['registration_date'],
            'status' => $product['status'] ?? 'active',
            'health_certificate_number' => $product['health_certificate_number'] ?? null,
            'health_certificate_expiry' => $product['health_certificate_expiry'] ?? null,
            'notes' => $product['notes'] ?? null,
        ]);
    }

    /**
     * Update product pivot data
     */
    private function updateProductPivot(Taxpayer $taxpayer, int $productId, array $product): void
    {
        if (!$taxpayer->products()->where('product_id', $productId)->exists()) {
            return;
        }

        $updateData = array_filter([
            'registration_date' => $product['registration_date'] ?? null,
            'status' => $product['status'] ?? null,
            'health_certificate_number' => $product['health_certificate_number'] ?? null,
            'health_certificate_expiry' => $product['health_certificate_expiry'] ?? null,
            'notes' => $product['notes'] ?? null,
        ]);

        if (!empty($updateData)) {
            $taxpayer->products()->updateExistingPivot($productId, $updateData);
        }
    }
}