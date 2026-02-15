<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaxpayerProduct extends Pivot
{
    use HasFactory;

    protected $table = 'taxpayer_products';

    protected $casts = [
        'registration_date' => 'date',
        'health_certificate_expiry' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $fillable = [
        'taxpayer_id',
        'product_id',
        'registration_date',
        'status',
        'rejection_reason',
        'notes',
        'certificate_path',
        'health_certificate_number',
        'health_certificate_expiry'
    ];

    /**
     * Get the taxpayer that owns the pivot
     */
    public function taxpayer()
    {
        return $this->belongsTo(Taxpayer::class);
    }

    /**
     * Get the product that owns the pivot
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Check if the product is approved
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the product is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the product is rejected
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if removal is requested
     */
    public function isRemovalRequested(): bool
    {
        return $this->status === 'removal_requested';
    }

    /**
     * Scope for approved products
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for pending products
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for rejected products
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}