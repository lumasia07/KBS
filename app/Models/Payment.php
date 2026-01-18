<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Payment extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'invoice_number',
        'order_id',
        'taxpayer_id',
        'amount',
        'tax_amount',
        'penalty_amount',
        'total_amount',
        'payment_method',
        'transaction_id',
        'payment_provider',
        'payment_provider_response',
        'status',
        'payment_date',
        'confirmation_date',
        'invoice_qr_code',
        'invoice_pdf_path',
        'is_refunded',
        'refund_amount',
        'refund_date',
        'refund_reason',
        'confirmed_by',
        'failure_reason'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'penalty_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'payment_provider_response' => 'array',
        'payment_date' => 'datetime',
        'confirmation_date' => 'datetime',
        'is_refunded' => 'boolean',
        'refund_amount' => 'decimal:2',
        'refund_date' => 'datetime'
    ];

    public function order()
    {
        return $this->belongsTo(StampOrder::class);
    }

    public function taxpayer()
    {
        return $this->belongsTo(Taxpayer::class);
    }

    public function confirmer()
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }
}