<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class StampVerification extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'stamp_id',
        'field_control_id',
        'verifier_id',
        'verification_method',
        'device_id',
        'device_model',
        'latitude',
        'longitude',
        'location_address',
        'is_valid',
        'verification_result',
        'details',
        'verification_date',
        'was_offline',
        'sync_date'
    ];

    protected $casts = [
        'verification_date' => 'datetime',
        'sync_date' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_valid' => 'boolean',
        'was_offline' => 'boolean'
    ];

    public function stamp()
    {
        return $this->belongsTo(Stamp::class);
    }

    public function fieldControl()
    {
        return $this->belongsTo(FieldControl::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verifier_id');
    }

    public function getLocationAttribute()
    {
        if ($this->location_address) {
            return $this->location_address;
        }

        if ($this->latitude && $this->longitude) {
            return "Lat: {$this->latitude}, Lng: {$this->longitude}";
        }

        return 'Unknown';
    }

    public function scopeValid($query)
    {
        return $query->where('verification_result', 'valid');
    }

    public function scopeInvalid($query)
    {
        return $query->where('verification_result', '!=', 'valid');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('verification_date', today());
    }

    public function scopeByMethod($query, $method)
    {
        return $query->where('verification_method', $method);
    }
}