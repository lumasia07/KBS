<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Taxpayer extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'tax_identification_number',
        'company_name',
        'legal_form_id',
        'trade_register_number',
        'trade_register_issue_date',
        'sector_id',
        'company_size_id',
        'physical_address',
        'district_id',
        'commune_id',
        'quartier_id',
        'avenue',
        'number',
        'plot_number',
        'email',
        'phone_number',
        'alternate_phone',
        'bank_name',
        'bank_account_number',
        'bank_account_holder',
        'legal_representative_name',
        'legal_representative_email',
        'legal_representative_phone',
        'legal_representative_id_number',
        'operational_contact_name',
        'operational_contact_email',
        'operational_contact_phone',
        'registration_status',
        'rejection_reason',
        'registration_date',
        'verification_date',
        'verified_by',
        'api_key',
        'api_key_expires_at',
    ];

    protected $casts = [
        'trade_register_issue_date' => 'date',
        'registration_date' => 'date',
        'verification_date' => 'date',
        'api_key_expires_at' => 'datetime',
    ];

    /**
     * Get the district that the taxpayer belongs to
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get the commune that the taxpayer belongs to
     */
    public function commune(): BelongsTo
    {
        return $this->belongsTo(Commune::class);
    }

    /**
     * Get the quartier that the taxpayer belongs to
     */
    public function quartier(): BelongsTo
    {
        return $this->belongsTo(Quartier::class);
    }

    /**
     * Get the legal form that the taxpayer belongs to
     */
    public function legalForm(): BelongsTo
    {
        return $this->belongsTo(LegalForm::class);
    }

    /**
     * Get the business sector that the taxpayer belongs to
     */
    public function sector(): BelongsTo
    {
        return $this->belongsTo(BusinessSector::class, 'sector_id');
    }

    /**
     * Get the company size that the taxpayer belongs to
     */
    public function companySize(): BelongsTo
    {
        return $this->belongsTo(CompanySize::class);
    }

    /**
     * Get the municipality that the taxpayer belongs to
     */
    public function municipality(): BelongsTo
    {
        return $this->belongsTo(Municipality::class);
    }

    /**
     * The products that belong to the taxpayer.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'taxpayer_products')
            ->using(TaxpayerProduct::class)
            ->withPivot([
                'registration_date',
                'status',
                'rejection_reason',
                'notes',
                'certificate_path',
                'health_certificate_number',
                'health_certificate_expiry'
            ])
            ->withTimestamps();
    }

    /**
     * Get active products for this taxpayer (approved status)
     */
    public function activeProducts()
    {
        return $this->products()->wherePivot('status', 'approved');
    }

    /**
     * Get pending products for this taxpayer
     */
    public function pendingProducts()
    {
        return $this->products()->wherePivot('status', 'pending');
    }

    /**
     * Get rejected products for this taxpayer
     */
    public function rejectedProducts()
    {
        return $this->products()->wherePivot('status', 'rejected');
    }

    /**
     * Get products requested for removal
     */
    public function removalRequestedProducts()
    {
        return $this->products()->wherePivot('status', 'removal_requested');
    }

    /**
     * Get the stamp orders for this taxpayer
     */
    public function orders(): HasMany
    {
        return $this->hasMany(StampOrder::class);
    }

    /**
     * Get the stamps for this taxpayer
     */
    public function stamps(): HasMany
    {
        return $this->hasMany(Stamp::class);
    }

    /**
     * Get the payments for this taxpayer
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the verifier user for this taxpayer
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the users associated with this taxpayer
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Check if taxpayer has a specific product
     */
    public function hasProduct($productId): bool
    {
        return $this->products()->where('product_id', $productId)->exists();
    }

    /**
     * Check if taxpayer has approved product
     */
    public function hasApprovedProduct($productId): bool
    {
        return $this->products()
            ->where('product_id', $productId)
            ->wherePivot('status', 'approved')
            ->exists();
    }

    /**
     * Scope taxpayers with pending products
     */
    public function scopeWithPendingProducts($query)
    {
        return $query->whereHas('products', function ($q) {
            $q->wherePivot('status', 'pending');
        });
    }

    /**
     * Scope approved taxpayers
     */
    public function scopeApproved($query)
    {
        return $query->where('registration_status', 'approved');
    }

    /**
     * Scope pending taxpayers
     */
    public function scopePending($query)
    {
        return $query->where('registration_status', 'pending');
    }
}