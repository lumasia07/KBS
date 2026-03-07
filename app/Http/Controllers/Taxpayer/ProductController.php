<?php

namespace App\Http\Controllers\Taxpayer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductCertificate;
use App\Models\Taxpayer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Throwable;

class ProductController extends Controller
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

        // Get active categories with their required certificate types
        $categories = Category::active()
            ->with([
                'certificateTypes' => function ($query) {
                    $query->wherePivot('is_required', true);
                }
            ])
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'requires_certificate' => $category->requires_certificate,
                    'required_certificate_types' => $category->certificateTypes->map(function ($certType) {
                        return [
                            'id' => $certType->id,
                            'name' => $certType->name,
                            'code' => $certType->code,
                            'specific_requirements' => $certType->pivot->specific_requirements,
                        ];
                    }),
                ];
            });

        return Inertia::render('taxpayer/products/create', [
            'availableProducts' => $availableProducts,
            'categories' => $categories,
            'unitTypes' => [
                ['value' => 'unit', 'label' => 'Unit'],
                ['value' => 'pack', 'label' => 'Pack'],
                ['value' => 'carton', 'label' => 'Carton'],
                ['value' => 'liter', 'label' => 'Liter'],
                ['value' => 'kilogram', 'label' => 'Kilogram'],
                ['value' => 'other', 'label' => 'Other'],
            ],
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

        // Get main data from JSON
        $mainData = json_decode($request->input('data'), true);

        // Get certificates count
        $certificatesCount = $request->input('certificates_count', 0);

        // Process certificates
        $certificates = [];

        for ($i = 0; $i < $certificatesCount; $i++) {
            $certData = json_decode($request->input("certificates.{$i}"), true);
            if ($certData) {
                // Convert empty strings to null for date fields
                if (isset($certData['expiry_date']) && $certData['expiry_date'] === '') {
                    $certData['expiry_date'] = null;
                }

                // Convert empty strings to null for other fields
                if (isset($certData['certificate_number']) && $certData['certificate_number'] === '') {
                    $certData['certificate_number'] = null;
                }

                if (isset($certData['issuing_country']) && $certData['issuing_country'] === '') {
                    $certData['issuing_country'] = null;
                }

                if (isset($certData['remarks']) && $certData['remarks'] === '') {
                    $certData['remarks'] = null;
                }

                $certData['file'] = $request->file("certificate_file_{$i}");
                $certificates[] = $certData;
            }
        }

        // Merge main data with certificates for validation
        $validationData = array_merge($mainData, ['certificates' => $certificates]);

        $validated = validator($validationData, [
            'name' => 'required|string|max:200',
            'category_id' => 'required|exists:categories,id',
            'unit_type' => 'required|string|in:unit,pack,carton,liter,kilogram,other',
            'description' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:500',
            'certificates' => 'required|array|min:1',
            'certificates.*.type_id' => 'required|exists:certificate_types,id',
            'certificates.*.certificate_number' => 'nullable|string|max:255',
            'certificates.*.issue_date' => 'required|date',
            'certificates.*.expiry_date' => 'nullable|date|after:certificates.*.issue_date',
            'certificates.*.issuing_authority' => 'required|string|max:255',
            'certificates.*.issuing_country' => 'nullable|string|max:100',
            'certificates.*.remarks' => 'nullable|string|max:500',
            'certificates.*.file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ])->validate();

        // Check if category requires certificates and user provided them
        $category = Category::with('requiredCertificateTypes')->find($validated['category_id']);
        if ($category->requires_certificate) {
            $requiredCertTypeIds = $category->requiredCertificateTypes()->pluck('certificate_type_id')->toArray();
            $providedCertTypeIds = collect($validated['certificates'])->pluck('type_id')->toArray();

            $missingRequired = array_diff($requiredCertTypeIds, $providedCertTypeIds);
            if (!empty($missingRequired)) {
                return back()->withErrors(['certificates' => 'Missing required certificates for this category'])->withInput();
            }
        }

        DB::beginTransaction();

        try {
            // Auto-generate product code
            $productCode = 'PROD-' . strtoupper(uniqid());

            // Create the product (inactive by default, pending approval)
            $product = Product::create([
                'code' => $productCode,
                'name' => $validated['name'],
                'category_id' => $validated['category_id'],
                'unit_type' => $validated['unit_type'],
                'stamp_price_per_unit' => 0, // Will be set by admin during approval
                'description' => $validated['description'] ?? null,
                'is_active' => false,
            ]);

            // Process each certificate
            foreach ($validated['certificates'] as $certificateData) {
                $certificatePath = null;

                // Handle file upload
                if (isset($certificateData['file']) && $certificateData['file'] instanceof \Illuminate\Http\UploadedFile) {
                    $path = 'certificates/' . $taxpayer->id . '/' . $product->id;
                    $certificatePath = $certificateData['file']->store($path, 'public');
                }

                // Ensure expiry_date is null if empty
                $expiryDate = null;
                if (isset($certificateData['expiry_date']) && !empty($certificateData['expiry_date'])) {
                    $expiryDate = $certificateData['expiry_date'];
                }

                // Create product certificate
                ProductCertificate::create([
                    'product_id' => $product->id,
                    'certificate_type_id' => $certificateData['type_id'],
                    'certificate_number' => $certificateData['certificate_number'] ?? null,
                    'issue_date' => $certificateData['issue_date'],
                    'expiry_date' => $expiryDate,
                    'issuing_authority' => $certificateData['issuing_authority'],
                    'issuing_country' => $certificateData['issuing_country'] ?? null,
                    'remarks' => $certificateData['remarks'] ?? null,
                    'file_path' => $certificatePath,
                    'is_valid' => true,
                ]);
            }

            // Now attach to taxpayer using the pivot table with status
            $taxpayer->products()->attach($product->id, [
                'registration_date' => now()->toDateString(),
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            return redirect()->route('taxpayer.products.index')
                ->with('success', 'Product and certificates submitted for approval.');
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Failed to create product', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to create product: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Show product details
     */
    public function show(int $productId)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $taxpayer = $user->taxpayer;

        $product = $taxpayer->products()
            ->with([
                'category',
                'productCertificates' => function ($query) {
                    $query->with('certificateType')->orderBy('expiry_date');
                }
            ])
            ->where('product_id', $productId)
            ->first();

        if (!$product) {
            return redirect()->route('taxpayer.products.index')
                ->withErrors(['error' => 'Product not found in your catalogue']);
        }

        $productDetails = [
            'id' => $product->id,
            'code' => $product->code,
            'name' => $product->name,
            'category' => $product->category?->name ?? 'Uncategorized',
            'unit_type' => $product->unit_type,
            'description' => $product->description,
            'registration_date' => $product->pivot->registration_date,
            'status' => $product->pivot->status,
            'rejection_reason' => $product->pivot->rejection_reason,
            'notes' => $product->pivot->notes,
            'certificates' => $product->productCertificates->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'certificate_type' => $cert->certificateType?->name,
                    'certificate_type_code' => $cert->certificateType?->code,
                    'certificate_number' => $cert->certificate_number,
                    'issue_date' => $cert->issue_date?->format('Y-m-d'),
                    'expiry_date' => $cert->expiry_date?->format('Y-m-d'),
                    'issuing_authority' => $cert->issuing_authority,
                    'issuing_country' => $cert->issuing_country,
                    'remarks' => $cert->remarks,
                    'file_url' => $cert->file_path ? asset('storage/' . $cert->file_path) : null,
                    'status' => $cert->status,
                    'is_valid' => $cert->isValid(),
                    'remaining_days' => $cert->remaining_days,
                ];
            }),
            'has_all_required_certificates' => $product->hasAllRequiredCertificates(),
            'missing_certificates' => $product->getMissingRequiredCertificates()->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'name' => $cert->name,
                    'specific_requirements' => $cert->pivot->specific_requirements ?? null,
                ];
            }),
        ];

        return Inertia::render('taxpayer/products/show', [
            'product' => $productDetails,
        ]);
    }

    /**
     * Update product notes or status (limited fields)
     */
    public function update(Request $request, int $productId)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $taxpayer = $user->taxpayer;

        // Check if product exists in catalogue
        if (!$taxpayer->products()->where('product_id', $productId)->exists()) {
            return back()->withErrors(['error' => 'Product not in your catalogue']);
        }

        $validated = $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $taxpayer->products()->updateExistingPivot($productId, [
            'notes' => $validated['notes'] ?? null,
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Product notes updated successfully');
    }

    /**
     * Request removal of a product from taxpayer's catalogue
     */
    public function destroy(int $productId)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $taxpayer = $user->taxpayer;

        // Check if product exists in catalogue
        $product = $taxpayer->products()->where('product_id', $productId)->first();

        if (!$product) {
            return back()->withErrors(['error' => 'Product not in your catalogue']);
        }

        // Instead of hard delete, update status to removal requested
        $taxpayer->products()->updateExistingPivot($productId, [
            'status' => 'removal_requested',
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Product removal requested. An administrator will review your request.');
    }

    /* ------------------------------------------------------------------
     | Certificate Management
     * ------------------------------------------------------------------ */

    /**
     * Add a new certificate to an existing product
     */
    public function addCertificate(Request $request, int $productId)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $taxpayer = $user->taxpayer;

        // Verify product belongs to taxpayer
        $product = $taxpayer->products()->where('product_id', $productId)->first();

        if (!$product) {
            return back()->withErrors(['error' => 'Product not in your catalogue']);
        }

        $validated = $request->validate([
            'certificate_type_id' => 'required|exists:certificate_types,id',
            'certificate_number' => 'nullable|string|max:255',
            'issue_date' => 'required|date',
            'expiry_date' => 'nullable|date|after:issue_date',
            'issuing_authority' => 'required|string|max:255',
            'issuing_country' => 'nullable|string|max:100',
            'remarks' => 'nullable|string|max:500',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $certificatePath = null;
        if ($request->hasFile('file')) {
            $path = 'certificates/' . $taxpayer->id . '/' . $productId;
            $certificatePath = $request->file('file')->store($path, 'public');
        }

        ProductCertificate::create([
            'product_id' => $productId,
            'certificate_type_id' => $validated['certificate_type_id'],
            'certificate_number' => $validated['certificate_number'] ?? null,
            'issue_date' => $validated['issue_date'],
            'expiry_date' => $validated['expiry_date'] ?? null,
            'issuing_authority' => $validated['issuing_authority'],
            'issuing_country' => $validated['issuing_country'] ?? null,
            'remarks' => $validated['remarks'] ?? null,
            'file_path' => $certificatePath,
            'is_valid' => true,
        ]);

        return back()->with('success', 'Certificate added successfully');
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
            ->with([
                'category',
                'productCertificates' => function ($query) {
                    $query->with('certificateType')->valid();
                }
            ])
            ->get()
            ->map(function ($product) {
                $validCertificates = $product->productCertificates;

                return [
                    'id' => $product->id,
                    'code' => $product->code,
                    'name' => $product->name,
                    'category' => $product->category?->name ?? 'Uncategorized',
                    'unit_type' => $product->unit_type,
                    'registration_date' => $product->pivot->registration_date,
                    'status' => $product->pivot->status,
                    'rejection_reason' => $product->pivot->rejection_reason,
                    'notes' => $product->pivot->notes,
                    'certificates_count' => $validCertificates->count(),
                    'has_valid_certificates' => $validCertificates->isNotEmpty(),
                    'certificates' => $validCertificates->map(function ($cert) {
                        return [
                            'id' => $cert->id,
                            'type' => $cert->certificateType?->name,
                            'expiry_date' => $cert->expiry_date?->format('Y-m-d'),
                            'is_expiring_soon' => $cert->expiry_date && $cert->expiry_date->diffInDays(now()) <= 30,
                        ];
                    }),
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
                ];
            })
            ->toArray();
    }
}
