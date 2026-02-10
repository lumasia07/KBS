<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
     * Products that have this certificate type
     */
    public function products()
    {
        return $this->hasManyThrough(Product::class, ProductCertificate::class);
    }

    /**
     * All certificates of this type
     */
    public function certificates()
    {
        return $this->hasMany(ProductCertificate::class);
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