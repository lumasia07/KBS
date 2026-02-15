<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'category_id',
        'unit_type',
        'stamp_price_per_unit',
        'is_active'
    ];

    protected $casts = [
        'stamp_price_per_unit' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    /**
     * Get the category that the product belongs to
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the product certificates
     */
    public function productCertificates(): HasMany
    {
        return $this->hasMany(ProductCertificate::class);
    }

    /**
     * Get the certificate types through product certificates
     */
    public function certificateTypes(): BelongsToMany
    {
        return $this->belongsToMany(CertificateType::class, 'product_certificates')
            ->withPivot([
                'certificate_number',
                'issue_date',
                'expiry_date',
                'issuing_authority',
                'issuing_country',
                'remarks',
                'file_path',
                'is_valid'
            ])
            ->withTimestamps();
    }

    /**
     * The taxpayers that have this product in their catalogue.
     */
    public function taxpayers(): BelongsToMany
    {
        return $this->belongsToMany(Taxpayer::class, 'taxpayer_products')
            ->using(TaxpayerProduct::class)
            ->withPivot([
                'registration_date',
                'status',
                'rejection_reason',
                'notes',
                'certificate_path',
                'health_certificate_number',
                'health_certificate_expiry'
            ])
            ->withTimestamps();
    }

    /**
     * Get active taxpayers for this product (approved status)
     */
    public function activeTaxpayers()
    {
        return $this->taxpayers()->wherePivot('status', 'approved');
    }

    /**
     * Get pending taxpayers for this product
     */
    public function pendingTaxpayers()
    {
        return $this->taxpayers()->wherePivot('status', 'pending');
    }

    /**
     * Check if product has a specific valid certificate type
     */
    public function hasValidCertificateType($certificateTypeId): bool
    {
        return $this->productCertificates()
            ->where('certificate_type_id', $certificateTypeId)
            ->where('is_valid', true)
            ->where(function ($query) {
                $query->whereNull('expiry_date')
                    ->orWhere('expiry_date', '>', now());
            })
            ->exists();
    }

    /**
     * Get valid certificates
     */
    public function validCertificates()
    {
        return $this->productCertificates()
            ->where('is_valid', true)
            ->where(function ($query) {
                $query->whereNull('expiry_date')
                    ->orWhere('expiry_date', '>', now());
            });
    }

    /**
     * Get expired certificates
     */
    public function expiredCertificates()
    {
        return $this->productCertificates()
            ->where('is_valid', true)
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<=', now());
    }

    /**
     * Check if product has all required certificates based on its category
     */
    public function hasAllRequiredCertificates(): bool
    {
        if (!$this->category) {
            return true;
        }

        $requiredCertTypes = $this->category->certificateTypes()
            ->wherePivot('is_required', true)
            ->get();

        if ($requiredCertTypes->isEmpty()) {
            return true;
        }

        foreach ($requiredCertTypes as $requiredCert) {
            if (!$this->hasValidCertificateType($requiredCert->id)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get missing required certificates
     */
    public function getMissingRequiredCertificates()
    {
        if (!$this->category) {
            return collect();
        }

        $requiredCertTypes = $this->category->certificateTypes()
            ->wherePivot('is_required', true)
            ->get();

        if ($requiredCertTypes->isEmpty()) {
            return collect();
        }

        return $requiredCertTypes->reject(function ($certType) {
            return $this->hasValidCertificateType($certType->id);
        });
    }

    /**
     * Scope active products
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope products with valid certificates
     */
    public function scopeWithValidCertificates($query)
    {
        return $query->whereHas('productCertificates', function ($q) {
            $q->where('is_valid', true)
                ->where(function ($subQ) {
                    $subQ->whereNull('expiry_date')
                        ->orWhere('expiry_date', '>', now());
                });
        });
    }

    /**
     * Scope products missing required certificates
     */
    public function scopeMissingRequiredCertificates($query)
    {
        return $query->whereHas('category', function ($q) {
            $q->whereHas('certificateTypes', function ($subQ) {
                $subQ->wherePivot('is_required', true);
            });
        })->whereDoesntHave('productCertificates', function ($q) {
            $q->where('is_valid', true)
                ->where(function ($dateQ) {
                    $dateQ->whereNull('expiry_date')
                        ->orWhere('expiry_date', '>', now());
                })
                ->whereIn('certificate_type_id', function ($subQuery) {
                    $subQuery->select('certificate_type_id')
                        ->from('category_certificate_type')
                        ->whereColumn('category_id', 'products.category_id')
                        ->where('is_required', true);
                });
        });
    }
}