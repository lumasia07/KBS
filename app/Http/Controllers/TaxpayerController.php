<?php

namespace App\Http\Controllers;

use App\Http\Requests\Taxpayer\StoreRequest;
use App\Http\Requests\Taxpayer\UpdateRequest;
use App\Mail\TaxpayerRegistrationMail;
use App\Mail\TaxpayerApprovalMail;
use App\Mail\TaxpayerRejectMail;
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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Yajra\DataTables\Facades\DataTables;

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
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            $query = Taxpayer::with(['sector', 'legalForm', 'district', 'commune']);

            return DataTables::of($query)
                ->editColumn('status', function ($taxpayer) {
                    return $taxpayer->registration_status;
                })
                ->addColumn('sector_name', function ($taxpayer) {
                    return $taxpayer->sector->name ?? '-';
                })
                ->addColumn('actions', function ($taxpayer) {
                    return 'actions';
                })
                ->make(true);
        }

        return Inertia::render('admin/taxpayers/index');
    }

    public function create()
    {
        return Inertia::render('TaxpayerRegistration', [
            'legalForms' => LegalForm::select('id', 'name', 'code')->get(),
            'sectors' => BusinessSector::select('id', 'name')->get(),
            'companySizes' => CompanySize::select('id', 'category')->get(),
            'districts' => District::select('id', 'name')->get(),
            'communes' => Commune::select('id', 'name', 'district_id')->get(),
            'quartiers' => Quartier::select('id', 'name', 'commune_id')->get(),
        ]);
    }

    public function store(StoreRequest $request)
    {
        DB::beginTransaction();

        $taxpayer = null;
        $taxpayerPassword = null;

        try {
            $validatedData = $request->validated();

            $taxpayerApiKey = $this->generateApiKey();
            $taxpayerApiKeyExpiresAt = now()->addYear();
            $taxpayerEmail = $this->generateTaxpayerEmail($validatedData['company_name']);
            $taxpayerPassword = Str::random(8);

            $validatedData['api_key'] = $taxpayerApiKey;
            $validatedData['api_key_expires_at'] = $taxpayerApiKeyExpiresAt;
            $validatedData['email'] = $taxpayerEmail;
            $validatedData['registration_date'] = now()->toDateString();
            $validatedData['registration_status'] = 'pending';

            $taxpayer = Taxpayer::create($validatedData);

            if ($taxpayer) {
                if ($request->filled('products')) {
                    $this->attachProductsToTaxpayer(
                        $taxpayer,
                        $request->products
                    );
                }

                $taxpayer->users()->create([
                    'first_name' => $validatedData['company_name'],
                    'last_name' => 'Admin',
                    'email' => $taxpayerEmail,
                    'department' => 'Administration',
                    'password' => bcrypt($taxpayerPassword),
                    'user_type' => 'taxpayer',
                    'is_active' => true,
                ]);
            }

            DB::commit();

        } catch (Throwable $e) {
            DB::rollBack();
            if ($request->wantsJson()) {
                return $this->failure($e, 'Failed to create taxpayer');
            }
            return back()->withInput()->withErrors([
                'error' => 'Failed to create taxpayer. Please try again.'
            ]);
        }

        // Send registration email
        try {
            Mail::to($taxpayer->email)->send(
                new TaxpayerRegistrationMail(
                    $taxpayer,
                    $taxpayerPassword
                )
            );
        } catch (Throwable $e) {
            Log::error('Registration email failed: ' . $e->getMessage(), [
                'taxpayer_id' => $taxpayer->id
            ]);
        }

        if ($request->wantsJson()) {
            return $this->success($taxpayer, 'Taxpayer created successfully');
        }

        return redirect()->route('login')->with(
            'success',
            'Registration successful! Please check your email for login credentials.'
        );
    }

    public function show(string $id)
    {
        try {
            $taxpayer = Taxpayer::findOrFail($id);
            $taxpayer = $this->loadTaxpayerRelationships($taxpayer, true);

            if (request()->wantsJson()) {
                return $this->success($taxpayer);
            }

            return Inertia::render('Taxpayer/Show', [
                'taxpayer' => $taxpayer,
                'products' => $taxpayer->products,
                'users' => $taxpayer->users,
                'orders' => $taxpayer->orders()->latest()->take(10)->get(),
                'payments' => $taxpayer->payments()->latest()->take(10)->get(),
            ]);

        } catch (ModelNotFoundException $e) {
            if (request()->wantsJson()) {
                return $this->notFound();
            }
            return redirect()->route('taxpayers.index')->with('error', 'Taxpayer not found.');
        } catch (Throwable $e) {
            if (request()->wantsJson()) {
                return $this->failure($e, 'Failed to fetch taxpayer');
            }
            return redirect()->route('taxpayers.index')->with('error', 'Failed to fetch taxpayer details.');
        }
    }

    public function edit(string $id)
    {
        try {
            $taxpayer = Taxpayer::findOrFail($id);
            $taxpayer = $this->loadTaxpayerRelationships($taxpayer, true);

            return Inertia::render('Taxpayer/Edit', [
                'taxpayer' => $taxpayer,
                'legalForms' => LegalForm::select('id', 'name', 'code')->get(),
                'sectors' => BusinessSector::select('id', 'name')->get(),
                'companySizes' => CompanySize::select('id', 'category')->get(),
                'districts' => District::select('id', 'name')->get(),
                'communes' => Commune::select('id', 'name', 'district_id')->get(),
                'quartiers' => Quartier::select('id', 'name', 'commune_id')->get(),
                'products' => Product::active()->select('id', 'name', 'code')->get(),
                'existingProducts' => $taxpayer->products->map(function ($product) {
                    return [
                        'product_id' => $product->id,
                        'name' => $product->name,
                        'code' => $product->code,
                        'pivot' => $product->pivot,
                    ];
                }),
            ]);

        } catch (ModelNotFoundException $e) {
            return redirect()->route('taxpayers.index')->with('error', 'Taxpayer not found.');
        } catch (Throwable $e) {
            return redirect()->route('taxpayers.index')->with('error', 'Failed to load edit form.');
        }
    }

    public function update(UpdateRequest $request, string $id)
    {
        DB::beginTransaction();

        try {
            $taxpayer = Taxpayer::findOrFail($id);
            $validatedData = $request->validated();

            // Handle status change and email notifications
            if ($this->shouldHandleStatusChange($taxpayer, $validatedData)) {
                $oldStatus = $taxpayer->registration_status;
                $newStatus = $validatedData['registration_status'];

                $validatedData = $this->processStatusChange($taxpayer, $validatedData);

                // Send status change emails
                if ($oldStatus === 'pending') {
                    if ($newStatus === 'verified') {
                        // Send approval email
                        Mail::to($taxpayer->email)->send(
                            new TaxpayerApprovalMail(
                                $taxpayer
                            )
                        );
                    } elseif ($newStatus === 'rejected') {
                        // Send rejection email
                        $rejectionReason = $validatedData['rejection_reason'] ?? 'Your application did not meet our verification requirements.';
                        Mail::to($taxpayer->email)->send(
                            new TaxpayerRejectMail(
                                $taxpayer,
                                $rejectionReason
                            )
                        );
                    }
                }
            }

            $taxpayer->update($validatedData);

            if ($request->filled('products')) {
                $this->updateTaxpayerProducts($taxpayer, $request->products);
            }

            DB::commit();

            $taxpayer->refresh();
            $taxpayer = $this->loadTaxpayerRelationships($taxpayer, true);

            if ($request->wantsJson()) {
                return $this->success($taxpayer, 'Taxpayer updated successfully');
            }

            return redirect()->route('taxpayers.show', $taxpayer->id)
                ->with('success', 'Taxpayer updated successfully');

        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            if ($request->wantsJson()) {
                return $this->notFound();
            }
            return back()->with('error', 'Taxpayer not found.');
        } catch (Throwable $e) {
            DB::rollBack();
            if ($request->wantsJson()) {
                return $this->failure($e, 'Failed to update taxpayer');
            }
            return back()->withInput()->withErrors([
                'error' => 'Failed to update taxpayer. Please try again.'
            ]);
        }
    }

    public function destroy(string $id)
    {
        DB::beginTransaction();

        try {
            $taxpayer = Taxpayer::findOrFail($id);
            $taxpayer->delete();

            DB::commit();

            if (request()->wantsJson()) {
                return $this->success(null, 'Taxpayer deleted successfully');
            }

            return redirect()->route('taxpayers.index')
                ->with('success', 'Taxpayer deleted successfully');

        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            if (request()->wantsJson()) {
                return $this->notFound();
            }
            return back()->with('error', 'Taxpayer not found.');
        } catch (Throwable $e) {
            DB::rollBack();
            if (request()->wantsJson()) {
                return $this->failure($e, 'Failed to delete taxpayer');
            }
            return back()->with('error', 'Failed to delete taxpayer. Please try again.');
        }
    }

    /* ------------------------------------------------------------------
     | Special Actions - Updated with Email Integration
     * ------------------------------------------------------------------ */

    /**
     * Verify a taxpayer
     */
    public function approve(string $id)
    {
        DB::beginTransaction();

        try {
            $taxpayer = Taxpayer::findOrFail($id);

            if ($taxpayer->registration_status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending taxpayers can be verified'
                ], 400);
            }

            $taxpayer->update([
                'registration_status' => 'verified',
                'verification_date' => now()->toDateString(),
                'verified_by' => Auth::id(),
                'rejection_reason' => null,
            ]);

            // Send approval email
            try {
                Mail::to($taxpayer->email)->send(
                    new TaxpayerApprovalMail(
                        $taxpayer
                    )
                );
            } catch (Throwable $e) {
                Log::error('Approval email failed: ' . $e->getMessage(), [
                    'taxpayer_id' => $taxpayer->id
                ]);
            }

            DB::commit();

            if (request()->wantsJson()) {
                return $this->success($taxpayer, 'Taxpayer verified successfully');
            }

            return back()->with('success', 'Taxpayer verified successfully');

        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            if (request()->wantsJson()) {
                return $this->notFound();
            }
            return back()->with('error', 'Taxpayer not found');
        } catch (Throwable $e) {
            DB::rollBack();
            if (request()->wantsJson()) {
                return $this->failure($e, 'Failed to verify taxpayer');
            }
            return back()->with('error', 'Failed to verify taxpayer');
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

        DB::beginTransaction();

        try {
            $taxpayer = Taxpayer::findOrFail($id);

            if ($taxpayer->registration_status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending taxpayers can be rejected'
                ], 400);
            }

            $taxpayer->update([
                'registration_status' => 'rejected',
                'rejection_reason' => $request->rejection_reason,
                'verified_by' => null,
                'verification_date' => null,
            ]);

            // Send rejection email
            try {
                Mail::to($taxpayer->email)->send(
                    new TaxpayerRejectMail(
                        $taxpayer,
                        $request->rejection_reason
                    )
                );
            } catch (Throwable $e) {
                Log::error('Rejection email failed: ' . $e->getMessage(), [
                    'taxpayer_id' => $taxpayer->id
                ]);
            }

            DB::commit();

            if (request()->wantsJson()) {
                return $this->success($taxpayer, 'Taxpayer rejected successfully');
            }

            return back()->with('success', 'Taxpayer rejected successfully');

        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            if (request()->wantsJson()) {
                return $this->notFound();
            }
            return back()->with('error', 'Taxpayer not found');
        } catch (Throwable $e) {
            DB::rollBack();
            if (request()->wantsJson()) {
                return $this->failure($e, 'Failed to reject taxpayer');
            }
            return back()->with('error', 'Failed to reject taxpayer');
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

    private function generateApiKey(): string
    {
        return Str::random(32);
    }

    private function generateTaxpayerEmail(string $companyName)
    {
        $domain = config('app.domain', 'taxsystem.local');
        $slug = Str::slug($companyName);
        $random = Str::random(6);

        return "{$slug}.{$random}@{$domain}";
    }

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

    private function shouldHandleStatusChange(Taxpayer $taxpayer, array $validatedData): bool
    {
        return isset($validatedData['registration_status']) &&
            $validatedData['registration_status'] !== $taxpayer->registration_status;
    }

    private function processStatusChange(Taxpayer $taxpayer, array $validatedData): array
    {
        $newStatus = $validatedData['registration_status'];

        switch ($newStatus) {
            case 'verified':
                $validatedData['verification_date'] = now()->toDateString();
                $validatedData['verified_by'] = Auth::id();
                $validatedData['rejection_reason'] = null;
                break;

            case 'rejected':
                $validatedData['verification_date'] = null;
                $validatedData['verified_by'] = null;
                break;

            default:
                $validatedData['verification_date'] = null;
                $validatedData['verified_by'] = null;
                $validatedData['rejection_reason'] = null;
                break;
        }

        return $validatedData;
    }

    private function attachProductsToTaxpayer(Taxpayer $taxpayer, array $products): void
    {
        $productData = [];

        foreach ($products as $product) {
            $productModel = Product::active()->find($product['product_id']);

            if (!$productModel) {
                continue;
            }

            $productData[$product['product_id']] = [
                'registration_date' => $product['registration_date'] ?? now()->toDateString(),
                'status' => $product['status'] ?? 'active',
                'health_certificate_number' => $product['health_certificate_number'] ?? null,
                'health_certificate_expiry' => $product['health_certificate_expiry'] ?? null,
                'notes' => $product['notes'] ?? null,
            ];
        }

        if (!empty($productData)) {
            $taxpayer->products()->attach($productData);
        }
    }

    private function updateTaxpayerProducts(Taxpayer $taxpayer, array $products): void
    {
        foreach ($products as $product) {
            $productId = $product['product_id'];
            $action = $product['action'] ?? 'attach';

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

    private function attachProduct(Taxpayer $taxpayer, array $product): void
    {
        $productId = $product['product_id'];

        $productModel = Product::active()->find($productId);

        if (!$productModel || $taxpayer->products()->where('product_id', $productId)->exists()) {
            return;
        }

        $taxpayer->products()->attach($productId, [
            'registration_date' => $product['registration_date'] ?? now()->toDateString(),
            'status' => $product['status'] ?? 'active',
            'health_certificate_number' => $product['health_certificate_number'] ?? null,
            'health_certificate_expiry' => $product['health_certificate_expiry'] ?? null,
            'notes' => $product['notes'] ?? null,
        ]);
    }

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
        ], function ($value) {
            return !is_null($value);
        });

        if (!empty($updateData)) {
            $taxpayer->products()->updateExistingPivot($productId, $updateData);
        }
    }
}