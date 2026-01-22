<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commune extends Model
{
    protected $fillable = [
        'district_id',
        'name'
    ];

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function quartiers(): HasMany
    {
        return $this->hasMany(Quartier::class);
    }
}