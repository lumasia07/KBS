<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TaxpayerProduct extends Pivot
{
    protected $table = 'taxpayer_products';

    protected $casts = [
        'registration_date' => 'date',
        'health_certificate_expiry' => 'date'
    ];

    protected $fillable = [
        'taxpayer_id',
        'product_id',
        'registration_date',
        'status',
        'health_certificate_number',
        'health_certificate_expiry',
        'notes'
    ];
}