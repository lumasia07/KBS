<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanySize extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'min_employees',
        'max_employees',
        'description'
    ];

    public function taxpayers()
    {
        return $this->hasMany(Taxpayer::class);
    }
}