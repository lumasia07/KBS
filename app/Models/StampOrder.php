<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class StampOrder extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'order_number',
        'taxpayer_id',
        'product_id',
        'stamp_type_id',
        'quantity',
        'packaging_type',
        'unit_price',
        'total_amount',
        'tax_amount',
        'penalty_amount',
        'grand_total',
        'status',
        'payment_reference',
        'payment_date',
        'payment_method',
        'payment_provider',
        'delivery_method',
        'delivery_address',
        'estimated_delivery_date',
        'actual_delivery_date',
        'delivery_confirmation_code',
        'import_declaration_path',
        'marketing_authorization_path',
        'certificate_of_conformity_path',
        'submitted_by',
        'approved_by',
        'rejection_reason'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'penalty_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'payment_date' => 'datetime',
        'estimated_delivery_date' => 'datetime',
        'actual_delivery_date' => 'datetime'
    ];

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

    public function stamps()
    {
        return $this->hasMany(Stamp::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function submitter()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}