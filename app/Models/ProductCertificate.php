<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductCertificate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id',
        'certificate_type_id',
        'certificate_number',
        'issue_date',
        'expiry_date',
        'issuing_authority',
        'issuing_country', // Added this
        'remarks', // Added this
        'file_path',
        'is_valid'
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'is_valid' => 'boolean'
    ];

    /**
     * The product this certificate belongs to
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * The certificate type
     */
    public function certificateType(): BelongsTo
    {
        return $this->belongsTo(CertificateType::class);
    }

    /**
     * Check if certificate is expired
     */
    public function isExpired(): bool
    {
        if (!$this->expiry_date) {
            return false;
        }

        return $this->expiry_date->isPast();
    }

    /**
     * Check if certificate is valid (not expired and marked as valid)
     */
    public function isValid(): bool
    {
        return $this->is_valid && !$this->isExpired();
    }

    /**
     * Scope valid certificates
     */
    public function scopeValid($query)
    {
        return $query->where('is_valid', true)
            ->where(function ($q) {
                $q->whereNull('expiry_date')
                    ->orWhere('expiry_date', '>', now());
            });
    }

    /**
     * Scope expired certificates
     */
    public function scopeExpired($query)
    {
        return $query->where('is_valid', true)
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<=', now());
    }

    /**
     * Scope certificates expiring soon
     */
    public function scopeExpiringSoon($query, $days = 30)
    {
        return $query->where('is_valid', true)
            ->whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [now(), now()->addDays($days)]);
    }
}