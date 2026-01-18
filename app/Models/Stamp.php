<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Stamp extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'serial_number',
        'qr_code',
        'order_id',
        'taxpayer_id',
        'product_id',
        'stamp_type_id',
        'status',
        'production_date',
        'production_batch',
        'produced_by',
        'activation_date',
        'activation_location',
        'activation_latitude',
        'activation_longitude',
        'activated_by',
        'expiry_date',
        'loss_type',
        'loss_description',
        'loss_declaration_date',
        'declared_by_taxpayer_id',
        'verification_count',
        'last_verification_at',
        'encryption_key',
        'digital_signature'
    ];

    protected $casts = [
        'production_date' => 'datetime',
        'activation_date' => 'datetime',
        'activation_latitude' => 'decimal:8',
        'activation_longitude' => 'decimal:8',
        'expiry_date' => 'datetime',
        'loss_declaration_date' => 'datetime',
        'last_verification_at' => 'datetime'
    ];

    public function order()
    {
        return $this->belongsTo(StampOrder::class);
    }

    public function taxpayer()
    {
        return $this->belongsTo(Taxpayer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function stampType()
    {
        return $this->belongsTo(StampType::class);
    }

    public function producer()
    {
        return $this->belongsTo(User::class, 'produced_by');
    }

    public function activator()
    {
        return $this->belongsTo(User::class, 'activated_by');
    }

    public function declaredBy()
    {
        return $this->belongsTo(Taxpayer::class, 'declared_by_taxpayer_id');
    }
}