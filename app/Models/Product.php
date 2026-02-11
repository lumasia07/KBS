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
        'is_active',
        'requires_health_certificate'
    ];

    protected $casts = [
        'stamp_price_per_unit' => 'decimal:2',
        'is_active' => 'boolean',
        'requires_health_certificate' => 'boolean'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }


    /**
     * Product certificates
     */
    public function certificates(): HasMany
    {
        return $this->hasMany(ProductCertificate::class);
    }

    /**
     * Certificate types via certificates
     */
    public function certificateTypes(): BelongsToMany
    {
        return $this->belongsToMany(CertificateType::class, 'product_certificates')
            ->withPivot(['certificate_number', 'issue_date', 'expiry_date', 'issuing_authority', 'is_valid'])
            ->withTimestamps();
    }

    /**
     * Check if product has a specific certificate type
     */
    public function hasCertificateType($certificateTypeId): bool
    {
        return $this->certificates()
            ->where('certificate_type_id', $certificateTypeId)
            ->where('is_valid', true)
            ->exists();
    }

    /**
     * Get valid certificates
     */
    public function validCertificates()
    {
        return $this->certificates()->where('is_valid', true);
    }

    /**
     * Get expired certificates
     */
    public function expiredCertificates()
    {
        return $this->certificates()
            ->where('is_valid', true)
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<', now());
    }

    /**
     * Check if product has all required certificates
     */
    public function hasAllRequiredCertificates(): bool
    {
        if (!$this->category || !$this->category->requires_certificate) {
            return true;
        }

        $requiredCertTypes = $this->category->requiredCertificateTypes()->pluck('certificate_type_id');

        if ($requiredCertTypes->isEmpty()) {
            return true;
        }

        $existingValidCertTypes = $this->validCertificates()
            ->whereIn('certificate_type_id', $requiredCertTypes)
            ->pluck('certificate_type_id');

        return $requiredCertTypes->diff($existingValidCertTypes)->isEmpty();
    }

    /**
     * Get missing required certificates
     */
    public function missingRequiredCertificates()
    {
        if (!$this->category || !$this->category->requires_certificate) {
            return collect();
        }

        $requiredCertTypes = $this->category->requiredCertificateTypes()->get();
        $existingValidCertTypes = $this->validCertificates()
            ->whereIn('certificate_type_id', $requiredCertTypes->pluck('id'))
            ->pluck('certificate_type_id');

        return $requiredCertTypes->whereNotIn('id', $existingValidCertTypes);
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
        return $query->whereHas('certificates', function ($q) {
            $q->where('is_valid', true);
        });
    }

    /**
     * Scope products missing required certificates
     */
    public function scopeMissingRequiredCertificates($query)
    {
        return $query->whereHas('category', function ($q) {
            $q->where('requires_certificate', true);
        })->whereDoesntHave('certificates', function ($q) {
            $q->whereIn('certificate_type_id', function ($subquery) {
                $subquery->select('certificate_type_id')
                    ->from('category_certificate_type')
                    ->whereColumn('category_id', 'products.category_id')
                    ->where('is_required', true);
            })->where('is_valid', true);
        });
    }
}