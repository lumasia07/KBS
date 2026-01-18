<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class FieldControl extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'control_number',
        'control_agent_id',
        'taxpayer_id',
        'business_name',
        'location_address',
        'latitude',
        'longitude',
        'municipality_id',
        'control_type',
        'control_date',
        'duration_minutes',
        'total_items_checked',
        'compliant_items',
        'non_compliant_items',
        'counterfeit_items',
        'status',
        'observations',
        'recommendations',
        'photos_paths',
        'documents_paths',
        'offence_declared',
        'offence_description',
        'proposed_fine',
        'offence_severity',
        'is_synced',
        'sync_date'
    ];

    protected $casts = [
        'control_date' => 'datetime',
        'sync_date' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'total_items_checked' => 'integer',
        'compliant_items' => 'integer',
        'non_compliant_items' => 'integer',
        'counterfeit_items' => 'integer',
        'duration_minutes' => 'integer',
        'proposed_fine' => 'decimal:2',
        'offence_declared' => 'boolean',
        'is_synced' => 'boolean',
        'photos_paths' => 'array',
        'documents_paths' => 'array'
    ];

    public function controlAgent()
    {
        return $this->belongsTo(User::class, 'control_agent_id');
    }

    public function taxpayer()
    {
        return $this->belongsTo(Taxpayer::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function stampVerifications()
    {
        return $this->hasMany(StampVerification::class);
    }

    public function getComplianceRateAttribute()
    {
        if ($this->total_items_checked === 0) {
            return 0;
        }
        return round(($this->compliant_items / $this->total_items_checked) * 100, 2);
    }

    public function getNonComplianceRateAttribute()
    {
        if ($this->total_items_checked === 0) {
            return 0;
        }
        return round(($this->non_compliant_items / $this->total_items_checked) * 100, 2);
    }

    public function getCounterfeitRateAttribute()
    {
        if ($this->total_items_checked === 0) {
            return 0;
        }
        return round(($this->counterfeit_items / $this->total_items_checked) * 100, 2);
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeRequiresFollowup($query)
    {
        return $query->where('status', 'requires_followup');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('control_date', today());
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('control_date', now()->month)
            ->whereYear('control_date', now()->year);
    }
}