<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone_number',
        'employee_id',
        'user_type',
        'department',
        'position',
        'municipality_id',
        'assigned_latitude',
        'assigned_longitude',
        'assigned_zone',
        'device_id',
        'device_token',
        'app_version',
        'is_active',
        'must_change_password',
        'last_password_change',
        'last_login_at',
        'last_login_ip',
        'failed_login_attempts',
        'locked_until',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
        'api_token',
        'api_token_expires_at',
        'taxpayer_id',
        'profile_image_path',
        'signature_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'api_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_password_change' => 'datetime',
        'last_login_at' => 'datetime',
        'locked_until' => 'datetime',
        'api_token_expires_at' => 'datetime',
        'two_factor_confirmed_at' => 'datetime',
        'is_active' => 'boolean',
        'must_change_password' => 'boolean',
        'assigned_latitude' => 'decimal:8',
        'assigned_longitude' => 'decimal:8',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'full_name',
        'initials',
        'role_names',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            // Set default values
            if (empty($user->user_type)) {
                $user->user_type = 'control_agent';
            }
        });

        static::created(function ($user) {
            // Assign default role based on user_type
            $user->assignDefaultRole();
        });
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the user's initials.
     */
    public function getInitialsAttribute(): string
    {
        return strtoupper(substr($this->first_name, 0, 1) . substr($this->last_name, 0, 1));
    }

    /**
     * Get the user's role names.
     */
    public function getRoleNamesAttribute(): array
    {
        return $this->getRoleNames()->toArray();
    }

    /**
     * Assign default role based on user_type.
     */
    public function assignDefaultRole(): void
    {
        $roleMap = [
            'admin' => 'System Administrator',
            'taxpayer' => 'Taxpayer User',
            'control_agent' => 'Field Control Agent',
            'supervisor' => 'Field Control Supervisor',
            'auditor' => 'Reporting Analyst',
            'finance' => 'Finance Officer',
            'support' => 'Complaints Officer',
            'api_user' => 'API User',
        ];

        if (isset($roleMap[$this->user_type]) && !$this->hasRole($roleMap[$this->user_type])) {
            $this->assignRole($roleMap[$this->user_type]);
        }
    }

    /**
     * Scope a query to only include active users.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include users of a specific type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('user_type', $type);
    }

    /**
     * Scope a query to only include users in a specific municipality.
     */
    public function scopeInMunicipality($query, $municipalityId)
    {
        return $query->where('municipality_id', $municipalityId);
    }

    /**
     * Scope a query to only include users assigned to a specific zone.
     */
    public function scopeInZone($query, $zone)
    {
        return $query->where('assigned_zone', $zone);
    }

    /**
     * Scope a query to only include field agents.
     */
    public function scopeFieldAgents($query)
    {
        return $query->where('user_type', 'control_agent');
    }

    /**
     * Scope a query to only include taxpayers.
     */
    public function scopeTaxpayers($query)
    {
        return $query->where('user_type', 'taxpayer');
    }

    /**
     * Scope a query to only include administrators.
     */
    public function scopeAdministrators($query)
    {
        return $query->whereIn('user_type', ['admin', 'supervisor', 'finance', 'auditor']);
    }

    /**
     * Check if user is a field agent.
     */
    public function isFieldAgent(): bool
    {
        return $this->user_type === 'control_agent';
    }

    /**
     * Check if user is a taxpayer user.
     */
    public function isTaxpayerUser(): bool
    {
        return $this->user_type === 'taxpayer';
    }

    /**
     * Check if user is an administrator.
     */
    public function isAdministrator(): bool
    {
        return in_array($this->user_type, ['admin', 'supervisor', 'finance', 'auditor', 'support']);
    }

    /**
     * Check if user is a system administrator.
     */
    public function isSystemAdmin(): bool
    {
        return $this->user_type === 'admin';
    }

    /**
     * Check if user is a supervisor.
     */
    public function isSupervisor(): bool
    {
        return $this->user_type === 'supervisor';
    }

    /**
     * Check if user must change password.
     */
    public function mustChangePassword(): bool
    {
        return $this->must_change_password || $this->last_password_change === null;
    }

    /**
     * Check if user account is locked.
     */
    public function isLocked(): bool
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    /**
     * Lock the user account.
     */
    public function lockAccount($minutes = 30): void
    {
        $this->update([
            'locked_until' => now()->addMinutes($minutes),
            'failed_login_attempts' => 0,
        ]);
    }

    /**
     * Unlock the user account.
     */
    public function unlockAccount(): void
    {
        $this->update([
            'locked_until' => null,
            'failed_login_attempts' => 0,
        ]);
    }

    /**
     * Record a failed login attempt.
     */
    public function recordFailedLoginAttempt(): void
    {
        $this->increment('failed_login_attempts');

        // Lock account after 5 failed attempts
        if ($this->failed_login_attempts >= 5) {
            $this->lockAccount();
        }
    }

    /**
     * Reset failed login attempts on successful login.
     */
    public function resetFailedLoginAttempts(): void
    {
        $this->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => now(),
        ]);
    }

    /**
     * Check if user has any of the given permissions.
     */
    public function hasPermissionToAny(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->can($permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if user has all of the given permissions.
     */
    public function hasPermissionToAll(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->can($permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get user's allowed municipalities (for field agents/supervisors).
     */
    public function getAllowedMunicipalities()
    {
        if ($this->isSystemAdmin() || $this->hasPermissionTo('view_all_controls')) {
            return Municipality::all();
        }

        if ($this->municipality_id) {
            return Municipality::where('id', $this->municipality_id)->get();
        }

        return collect();
    }

    /**
     * Get user's allowed zones (for field agents).
     */
    public function getAllowedZones(): array
    {
        if ($this->assigned_zone) {
            return explode(',', $this->assigned_zone);
        }

        return [];
    }

    /**
     * Check if user can access a specific taxpayer.
     */
    public function canAccessTaxpayer($taxpayerId): bool
    {
        if ($this->isTaxpayerUser() && $this->taxpayer_id === $taxpayerId) {
            return true;
        }

        if ($this->hasPermissionTo('view_all_taxpayers')) {
            return true;
        }

        // For field agents/supervisors, check if taxpayer is in their assigned municipality
        if ($this->municipality_id) {
            $taxpayer = Taxpayer::find($taxpayerId);
            return $taxpayer && $taxpayer->municipality_id === $this->municipality_id;
        }

        return false;
    }

    /**
     * Relationships
     */
    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function taxpayer()
    {
        return $this->belongsTo(Taxpayer::class, 'taxpayer_id');
    }

    // Relationships to be added after creating other models
    public function fieldControls()
    {
        return $this->hasMany(FieldControl::class, 'control_agent_id');
    }

    public function stampVerifications()
    {
        return $this->hasMany(StampVerification::class, 'verifier_id');
    }

    public function verifiedTaxpayers()
    {
        return $this->hasMany(Taxpayer::class, 'verified_by');
    }

    public function approvedOrders()
    {
        return $this->hasMany(StampOrder::class, 'approved_by');
    }

    public function confirmedPayments()
    {
        return $this->hasMany(Payment::class, 'confirmed_by');
    }

    public function generatedReports()
    {
        return $this->hasMany(Report::class, 'generated_by');
    }

    public function assignedComplaints()
    {
        return $this->hasMany(Complaint::class, 'assigned_to');
    }

    public function resolvedComplaints()
    {
        return $this->hasMany(Complaint::class, 'resolved_by');
    }

    // New relationships for the models we created
    public function submittedOrders()
    {
        return $this->hasMany(StampOrder::class, 'submitted_by');
    }

    public function producedStamps()
    {
        return $this->hasMany(Stamp::class, 'produced_by');
    }

    public function activatedStamps()
    {
        return $this->hasMany(Stamp::class, 'activated_by');
    }

    /**
     * Get user's dashboard statistics based on role.
     */
    public function getDashboardStats(): array
    {
        $stats = [];

        if ($this->isTaxpayerUser()) {
            $stats = [
                'total_orders' => $this->taxpayer->orders()->count(),
                'pending_orders' => $this->taxpayer->orders()->whereIn('status', ['draft', 'submitted', 'pending_verification'])->count(),
                'total_payments' => $this->taxpayer->payments()->count(),
                'active_stamps' => $this->taxpayer->stamps()->whereIn('status', ['affixed', 'activated'])->count(),
            ];
        } elseif ($this->isFieldAgent()) {
            $stats = [
                'today_controls' => $this->fieldControls()->whereDate('control_date', today())->count(),
                'month_controls' => $this->fieldControls()->whereMonth('control_date', now()->month)->count(),
                'total_verifications' => $this->stampVerifications()->count(),
                'non_compliant_items' => $this->fieldControls()->sum('non_compliant_items'),
            ];
        } elseif ($this->isAdministrator()) {
            $stats = [
                'total_taxpayers' => Taxpayer::count(),
                'pending_orders' => StampOrder::whereIn('status', ['submitted', 'pending_verification'])->count(),
                'pending_payments' => Payment::where('status', 'pending')->count(),
                'pending_complaints' => Complaint::where('status', 'new')->count(),
            ];
        }

        return $stats;
    }
}