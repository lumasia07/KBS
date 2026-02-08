<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'requires_health_certificate',
        'is_active'
    ];

    protected $casts = [
        'stamp_price_per_unit' => 'decimal:2',
        'requires_health_certificate' => 'boolean',
        'is_active' => 'boolean'
    ];

    public function taxpayers()
    {
        return $this->belongsToMany(Taxpayer::class, 'taxpayer_products')
            ->withPivot('registration_date', 'status', 'health_certificate_number', 'health_certificate_expiry', 'notes')
            ->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(StampOrder::class);
    }

    public function stamps()
    {
        return $this->hasMany(Stamp::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}