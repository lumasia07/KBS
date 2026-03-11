<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'decree_reference',
        'description',
        'origin_type',
        'production_type',
        'applicable_standards',
        'requires_certificate',
        'is_active',
        'parent_id',
        'sort_order',
    ];

    protected $casts = [
        'requires_certificate' => 'boolean',
        'is_active' => 'boolean',
        'applicable_standards' => 'array',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Certificate types required for this category
     */
    public function certificateTypes(): BelongsToMany
    {
        return $this->belongsToMany(CertificateType::class, 'category_certificate_type')
            ->withPivot(['is_required', 'specific_requirements'])
            ->withTimestamps();
    }

    /**
     * Products in this category
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Required certificate types for this category
     */
    public function requiredCertificateTypes()
    {
        return $this->certificateTypes()->wherePivot('is_required', true);
    }

    /**
     * Optional certificate types for this category
     */
    public function optionalCertificateTypes()
    {
        return $this->certificateTypes()->wherePivot('is_required', false);
    }

    /**
     * Check if category requires a specific certificate type
     */
    public function requiresCertificateType($certificateTypeId): bool
    {
        return $this->certificateTypes()
            ->where('certificate_type_id', $certificateTypeId)
            ->wherePivot('is_required', true)
            ->exists();
    }

    /**
     * Scope active categories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope categories that require certificates
     */
    public function scopeRequiringCertificates($query)
    {
        return $query->where('requires_certificate', true);
    }
}