<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class District extends Model
{
    protected $fillable = [
        'name'
    ];

    public function communes(): HasMany
    {
        return $this->hasMany(Commune::class);
    }

    public function quartiers()
    {
        return $this->hasManyThrough(Quartier::class, Commune::class);
    }
}