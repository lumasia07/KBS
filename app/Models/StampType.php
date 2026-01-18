<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StampType extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'technology',
        'description',
        'security_features',
        'unit_cost',
        'is_active'
    ];

    protected $casts = [
        'unit_cost' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    public function orders()
    {
        return $this->hasMany(StampOrder::class);
    }

    public function stamps()
    {
        return $this->hasMany(Stamp::class);
    }
}