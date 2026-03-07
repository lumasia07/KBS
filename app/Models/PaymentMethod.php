<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentMethod extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'type',
        'icon',
        'description',
        'providers',
        'settings',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'providers' => 'array',
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get all payments using this payment method
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include active payment methods
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by payment type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get available providers as array
     */
    public function getProvidersListAttribute(): array
    {
        return $this->providers ?? [];
    }

    /**
     * Check if payment method requires phone number
     */
    public function requiresPhoneNumber(): bool
    {
        return $this->settings['requires_phone'] ?? false;
    }

    /**
     * Check if payment method requires bank name
     */
    public function requiresBankName(): bool
    {
        return $this->settings['requires_bank_name'] ?? false;
    }

    /**
     * Check if payment method requires reference
     */
    public function requiresReference(): bool
    {
        return $this->settings['requires_reference'] ?? true;
    }
}