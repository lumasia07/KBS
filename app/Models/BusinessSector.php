<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessSector extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'tax_rate',
        'is_active'
    ];

    protected $casts = [
        'tax_rate' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    public function taxpayers()
    {
        return $this->hasMany(Taxpayer::class, 'sector_id');
    }
}