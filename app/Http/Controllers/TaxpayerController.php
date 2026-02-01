<?php

namespace App\Http\Controllers;

use App\Http\Requests\Taxpayer\StoreRequest;
use App\Http\Requests\Taxpayer\UpdateRequest;
use App\Mail\TaxpayerRegistrationMail;
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
        // Check if it's an AJAX request for DataTables
        if ($request->ajax() || $request->has('draw')) {
            return $this->datatable($request);
        }

        // Return Inertia view for non-AJAX requests
        return Inertia::render('Taxpayer/Index', [
            'initialData' => $this->getIndexData(),
            'filters' => $request->only(['search', 'status', 'sector']),
        ]);
    }

    /**
     * Get data for DataTables
     */
    private function datatable(Request $request)
    {
        $query = Taxpayer::with(['legalForm', 'sector', 'district', 'commune'])
            ->select('taxpayers.*');

        // Apply filters
        if ($request->has('search') && !empty($request->search['value'])) {
            $search = $request->search['value'];
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'LIKE', "%{$search}%")
                    ->orWhere('tax_identification_number', 'LIKE', "%{$search}%")
                    ->orWhere('trade_register_number', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('phone_number', 'LIKE', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('registration_status', $request->status);
        }

        // Filter by sector
        if ($request->filled('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }

        // Apply ordering
        if ($request->has('order')) {
            $columns = $request->columns;
            foreach ($request->order as $order) {
                $columnIndex = $order['column'];
                $columnName = $columns[$columnIndex]['data'] ?? $columns[$columnIndex]['name'];
                $direction = $order['dir'];

                // Map frontend column names to database columns
                $columnMap = [
                    'company_name' => 'company_name',
                    'tax_identification_number' => 'tax_identification_number',
                    'legal_form' => 'legal_form_id',
                    'sector' => 'sector_id',
                    'registration_status' => 'registration_status',
                    'registration_date' => 'registration_date',
                    'email' => 'email',
                    'phone_number' => 'phone_number',
                ];

                if (isset($columnMap[$columnName])) {
                    $query->orderBy($columnMap[$columnName], $direction);
                }
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return DataTables::eloquent($query)
            ->addColumn('actions', function (Taxpayer $taxpayer) {
                return [
                    'view' => route('taxpayers.show', $taxpayer->id),
                    'edit' => route('taxpayers.edit', $taxpayer->id),
                    'verify' => $taxpayer->registration_status === 'pending' ? route('taxpayers.verify', $taxpayer->id) : null,
                    'reject' => $taxpayer->registration_status === 'pending' ? route('taxpayers.reject', $taxpayer->id) : null,
                    'delete' => route('taxpayers.destroy', $taxpayer->id),
                ];
            })
            ->addColumn('legal_form', function (Taxpayer $taxpayer) {
                return $taxpayer->legalForm->name ?? '-';
            })
            ->addColumn('sector', function (Taxpayer $taxpayer) {
                return $taxpayer->sector->name ?? '-';
            })
            ->addColumn('location', function (Taxpayer $taxpayer) {
                $location = [];
                if ($taxpayer->district)
                    $location[] = $taxpayer->district->name;
                if ($taxpayer->commune)
                    $location[] = $taxpayer->commune->name;
                return implode(', ', $location) ?: '-';
            })
            ->addColumn('registration_date_formatted', function (Taxpayer $taxpayer) {
                return $taxpayer->registration_date
                    ? $taxpayer->registration_date->format('d/m/Y')
                    : '-';
            })
            ->addColumn('status_badge', function (Taxpayer $taxpayer) {
                $statusColors = [
                    'pending' => 'warning',
                    'verified' => 'success',
                    'rejected' => 'danger',
                    'suspended' => 'secondary',
                ];

                return [
                    'text' => ucfirst($taxpayer->registration_status),
                    'color' => $statusColors[$taxpayer->registration_status] ?? 'secondary'
                ];
            })
            ->filterColumn('legal_form', function ($query, $keyword) {
                $query->whereHas('legalForm', function ($q) use ($keyword) {
                    $q->where('name', 'LIKE', "%{$keyword}%");
                });
            })
            ->filterColumn('sector', function ($query, $keyword) {
                $query->whereHas('sector', function ($q) use ($keyword) {
                    $q->where('name', 'LIKE', "%{$keyword}%");
                });
            })
            ->rawColumns(['actions'])
            ->make(true);
    }

    /**
     * Get data for Inertia view
     */
    private function getIndexData()
    {
        return [
            'taxpayers' => Taxpayer::with(['legalForm', 'sector', 'district'])
                ->latest()
                ->take(10)
                ->get()
                ->map(function ($taxpayer) {
                    return [
                        'id' => $taxpayer->id,
                        'company_name' => $taxpayer->company_name,
                        'tax_identification_number' => $taxpayer->tax_identification_number,
                        'legal_form' => $taxpayer->legalForm->name ?? '-',
                        'sector' => $taxpayer->sector->name ?? '-',
                        'registration_status' => $taxpayer->registration_status,
                        'email' => $taxpayer->email,
                        'phone_number' => $taxpayer->phone_number,
                        'registration_date' => $taxpayer->registration_date?->format('d/m/Y'),
                    ];
                }),
            'statuses' => ['pending', 'verified', 'rejected', 'suspended'],
            'sectors' => BusinessSector::select('id', 'name')->get(),
            'stats' => [
                'total' => Taxpayer::count(),
                'pending' => Taxpayer::where('registration_status', 'pending')->count(),
                'verified' => Taxpayer::where('registration_status', 'verified')->count(),
                'rejected' => Taxpayer::where('registration_status', 'rejected')->count(),
            ],
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        DB::beginTransaction();

        $taxpayer = null;
        $taxpayerPassword = null;
        $emailRecipient = null;

        try {
            $validatedData = $request->validated();

            // Generate API credentials
            $taxpayerApiKey = $this->generateApiKey();
            $taxpayerApiKeyExpiresAt = now()->addYear();
            $taxpayerEmail = $this->generateTaxpayerEmail($validatedData['company_name']);
            $taxpayerPassword = Str::random(8);

            $validatedData['api_key'] = $taxpayerApiKey;
            $validatedData['api_key_expires_at'] = $taxpayerApiKeyExpiresAt;
            $validatedData['email'] = $taxpayerEmail;
            $validatedData['registration_date'] = now()->toDateString();
            $validatedData['registration_status'] = 'pending';

            // Store email recipient for later
            $emailRecipient = $validatedData['contact_email'] ?? $taxpayerEmail;

            // Create taxpayer
            $taxpayer = Taxpayer::create($validatedData);

            if ($taxpayer) {
                // Attach products if provided
                if ($request->filled('products')) {
                    $this->attachProductsToTaxpayer(
                        $taxpayer,
                        $request->products
                    );
                }

                // Create admin user
                $user = $taxpayer->users()->create([
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
            Log::error('Taxpayer creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            if ($request->wantsJson()) {
                return $this->failure($e, 'Failed to create taxpayer');
            }

            return back()->withInput()->withErrors([
                'error' => 'Failed to create taxpayer. Please try again.'
            ]);
        }

        // Send email notification AFTER successful transaction commit
        // This ensures DB changes are saved even if email fails
        if ($taxpayer && config('mail.enabled', true)) {
            try {
                Mail::to($emailRecipient)->send(
                    new TaxpayerRegistrationMail(
                        $taxpayer,
                        $taxpayerPassword
                    )
                );
            } catch (Throwable $e) {
                // Log email failure but don't fail the registration
                Log::warning('Registration email failed to send: ' . $e->getMessage(), [
                    'taxpayer_id' => $taxpayer->id,
                    'email' => $emailRecipient
                ]);
            }
        }

        if ($request->wantsJson()) {
            return $this->success($taxpayer, 'Taxpayer created successfully');
        }

        return redirect()->route('login')->with(
            'success',
            'Registration successful! Please check your email for login credentials.'
        );
    }

    /**
     * Display the specified resource.
     */
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

    /**
     * Show the form for editing the specified resource.
     */
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
            Log::error('Error loading taxpayer edit: ' . $e->getMessage());
            return redirect()->route('taxpayers.index')->with('error', 'Failed to load edit form.');
        }
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
            // if ($request->boolean('regenerate_api_key') && Auth::user()->can('regenerate-api-key', $taxpayer)) {
            //     $validatedData = array_merge($validatedData, $this->regenerateApiKeyForTaxpayer($taxpayer, $validatedData));
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
            Log::error('Taxpayer update failed: ' . $e->getMessage(), [
                'taxpayer_id' => $id,
                'request' => $request->all()
            ]);

            if ($request->wantsJson()) {
                return $this->failure($e, 'Failed to update taxpayer');
            }

            return back()->withInput()->withErrors([
                'error' => 'Failed to update taxpayer. Please try again.'
            ]);
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
            Log::error('Taxpayer deletion failed: ' . $e->getMessage(), [
                'taxpayer_id' => $id
            ]);

            if (request()->wantsJson()) {
                return $this->failure($e, 'Failed to delete taxpayer');
            }

            return back()->with('error', 'Failed to delete taxpayer. Please try again.');
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
            ]);

            if (request()->wantsJson()) {
                return $this->success($taxpayer, 'Taxpayer verified successfully');
            }

            return back()->with('success', 'Taxpayer verified successfully');

        } catch (ModelNotFoundException $e) {
            if (request()->wantsJson()) {
                return $this->notFound();
            }
            return back()->with('error', 'Taxpayer not found');
        } catch (Throwable $e) {
            Log::error('Taxpayer verification failed: ' . $e->getMessage());

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
            ]);

            if (request()->wantsJson()) {
                return $this->success($taxpayer, 'Taxpayer rejected successfully');
            }

            return back()->with('success', 'Taxpayer rejected successfully');

        } catch (ModelNotFoundException $e) {
            if (request()->wantsJson()) {
                return $this->notFound();
            }
            return back()->with('error', 'Taxpayer not found');
        } catch (Throwable $e) {
            Log::error('Taxpayer rejection failed: ' . $e->getMessage());

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

            // if (!Auth::user()->can('regenerate-api-key', $taxpayer)) {
            //     return response()->json([
            //         'success' => false,
            //         'message' => 'You do not have permission to regenerate API key'
            //     ], 403);
            // }

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
            Log::error('API key regeneration failed: ' . $e->getMessage());
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
        return Str::random(32);
    }

    private function generateTaxpayerEmail(string $companyName)
    {
        $domain = config('app.domain', 'taxsystem.local');
        $slug = Str::slug($companyName);
        $random = Str::random(6);

        return "{$slug}.{$random}@{$domain}";
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
            $validatedData['rejection_reason'] = null;
        } elseif ($validatedData['registration_status'] === 'rejected') {
            $validatedData['verification_date'] = null;
            $validatedData['verified_by'] = null;
        } else {
            // For other status changes, clear verification and rejection data
            $validatedData['verification_date'] = null;
            $validatedData['verified_by'] = null;
            $validatedData['rejection_reason'] = null;
        }

        return $validatedData;
    }

    /**
     * Regenerate API key for taxpayer
     */
    private function regenerateApiKeyForTaxpayer(Taxpayer $taxpayer, array $validatedData): array
    {
        return [
            'api_key' => $this->generateApiKey(),
            'api_key_expires_at' => now()->addYear(),
        ];
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

    /**
     * Update taxpayer products based on actions
     */
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
            'registration_date' => $product['registration_date'] ?? now()->toDateString(),
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
        ], function ($value) {
            return !is_null($value);
        });

        if (!empty($updateData)) {
            $taxpayer->products()->updateExistingPivot($productId, $updateData);
        }
    }
}