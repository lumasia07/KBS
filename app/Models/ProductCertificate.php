<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductCertificate extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'product_certificates';

    protected $fillable = [
        'product_id',
        'certificate_type_id',
        'certificate_number',
        'issue_date',
        'expiry_date',
        'issuing_authority',
        'issuing_country',
        'remarks',
        'file_path',
        'is_valid'
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'is_valid' => 'boolean'
    ];

    /**
     * Get the product that owns this certificate
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the certificate type
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
     * Check if certificate is currently valid
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

    /**
     * Get the remaining days until expiry
     */
    public function getRemainingDaysAttribute(): ?int
    {
        if (!$this->expiry_date) {
            return null;
        }

        return now()->diffInDays($this->expiry_date, false);
    }

    /**
     * Get formatted status
     */
    public function getStatusAttribute(): string
    {
        if (!$this->is_valid) {
            return 'Invalid';
        }

        if ($this->isExpired()) {
            return 'Expired';
        }

        if ($this->expiry_date && $this->expiry_date->diffInDays(now()) <= 30) {
            return 'Expiring Soon';
        }

        return 'Valid';
    }
}