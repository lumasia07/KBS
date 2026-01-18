<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Complaint extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'complaint_number',
        'taxpayer_id',
        'complainant_name',
        'complainant_email',
        'complainant_phone',
        'type',
        'subject',
        'description',
        'attachments_paths',
        'status',
        'priority',
        'assigned_to',
        'resolution',
        'resolved_at',
        'resolved_by',
        'order_id',
        'payment_id',
        'stamp_id'
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
        'attachments_paths' => 'array',
        'priority' => 'string'
    ];

    public function taxpayer()
    {
        return $this->belongsTo(Taxpayer::class);
    }

    public function order()
    {
        return $this->belongsTo(StampOrder::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function stamp()
    {
        return $this->belongsTo(Stamp::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function isOpen()
    {
        return in_array($this->status, ['new', 'in_review', 'in_progress']);
    }

    public function isClosed()
    {
        return in_array($this->status, ['resolved', 'rejected']);
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', ['new', 'in_review', 'in_progress']);
    }

    public function scopeClosed($query)
    {
        return $query->whereIn('status', ['resolved', 'rejected']);
    }

    public function scopeHighPriority($query)
    {
        return $query->whereIn('priority', ['high', 'urgent']);
    }

    public function scopeAssignedToMe($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeUnassigned($query)
    {
        return $query->whereNull('assigned_to');
    }

    public function getDaysOpenAttribute()
    {
        if ($this->isClosed()) {
            return $this->created_at->diffInDays($this->resolved_at);
        }
        return $this->created_at->diffInDays(now());
    }
}