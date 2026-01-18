<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_type',
        'action',
        'table_name',
        'record_id',
        'old_values',
        'new_values',
        'description',
        'ip_address',
        'user_agent',
        'device_id',
        'latitude',
        'longitude'
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getChangesAttribute()
    {
        if (!$this->old_values || !$this->new_values) {
            return [];
        }

        $changes = [];
        foreach ($this->new_values as $key => $newValue) {
            $oldValue = $this->old_values[$key] ?? null;
            if ($oldValue != $newValue) {
                $changes[$key] = [
                    'from' => $oldValue,
                    'to' => $newValue
                ];
            }
        }

        return $changes;
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByTable($query, $tableName)
    {
        return $query->where('table_name', $tableName);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function scopeLast7Days($query)
    {
        return $query->where('created_at', '>=', now()->subDays(7));
    }

    public function scopeByRecord($query, $tableName, $recordId)
    {
        return $query->where('table_name', $tableName)
            ->where('record_id', $recordId);
    }

    public function getLocationAttribute()
    {
        if ($this->latitude && $this->longitude) {
            return "Lat: {$this->latitude}, Lng: {$this->longitude}";
        }

        return $this->ip_address ?: 'Unknown';
    }
}