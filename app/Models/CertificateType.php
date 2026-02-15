<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CertificateType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'requirements',
        'is_required_by_default',
        'is_active'
    ];

    protected $casts = [
        'requirements' => 'array',
        'is_required_by_default' => 'boolean',
        'is_active' => 'boolean'
    ];

    /**
     * Categories that require this certificate type
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_certificate_type')
            ->withPivot(['is_required', 'specific_requirements'])
            ->withTimestamps();
    }

    /**
     * Product certificates of this type
     */
    public function productCertificates(): HasMany
    {
        return $this->hasMany(ProductCertificate::class);
    }

    /**
     * Products that have this certificate type (through product_certificates)
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_certificates')
            ->withPivot(['certificate_number', 'issue_date', 'expiry_date', 'issuing_authority', 'issuing_country', 'remarks', 'file_path', 'is_valid'])
            ->withTimestamps();
    }

    /**
     * Scope active certificate types
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope required by default
     */
    public function scopeRequiredByDefault($query)
    {
        return $query->where('is_required_by_default', true);
    }
}