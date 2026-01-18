<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Notification extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'type',
        'title',
        'message',
        'data',
        'taxpayer_id',
        'user_id',
        'email',
        'phone_number',
        'delivery_method',
        'email_sent',
        'sms_sent',
        'in_app_delivered',
        'email_sent_at',
        'sms_sent_at',
        'read_at',
        'priority',
        'expires_at'
    ];

    protected $casts = [
        'data' => 'array',
        'email_sent_at' => 'datetime',
        'sms_sent_at' => 'datetime',
        'read_at' => 'datetime',
        'expires_at' => 'datetime',
        'email_sent' => 'boolean',
        'sms_sent' => 'boolean',
        'in_app_delivered' => 'boolean'
    ];

    public function taxpayer()
    {
        return $this->belongsTo(Taxpayer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recipient()
    {
        if ($this->user_id) {
            return $this->user;
        }
        if ($this->taxpayer_id) {
            return $this->taxpayer;
        }
        return null;
    }

    public function isRead()
    {
        return !is_null($this->read_at);
    }

    public function isUnread()
    {
        return is_null($this->read_at);
    }

    public function isExpired()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function markAsRead()
    {
        if (!$this->isRead()) {
            $this->update(['read_at' => now()]);
        }
    }

    public function markAsUnread()
    {
        $this->update(['read_at' => null]);
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForTaxpayer($query, $taxpayerId)
    {
        return $query->where('taxpayer_id', $taxpayerId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high')->orWhere('priority', 'urgent');
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function getRecipientNameAttribute()
    {
        if ($this->user) {
            return $this->user->full_name;
        }
        if ($this->taxpayer) {
            return $this->taxpayer->company_name;
        }
        return $this->email ?? $this->phone_number ?? 'Unknown';
    }
}