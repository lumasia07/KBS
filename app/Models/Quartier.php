<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quartier extends Model
{
    protected $fillable = [
        'commune_id',
        'name'
    ];

    public function commune(): BelongsTo
    {
        return $this->belongsTo(Commune::class);
    }

    public function district()
    {
        return $this->commune->district();
    }
}