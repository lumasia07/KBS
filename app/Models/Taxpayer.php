<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Taxpayer extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    // In Taxpayer.php model
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

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function commune()
    {
        return $this->belongsTo(Commune::class);
    }

    public function quartier()
    {
        return $this->belongsTo(Quartier::class);
    }

    public function legalForm()
    {
        return $this->belongsTo(LegalForm::class);
    }

    public function sector()
    {
        return $this->belongsTo(BusinessSector::class, 'sector_id');
    }

    public function companySize()
    {
        return $this->belongsTo(CompanySize::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'taxpayer_products')
            ->withPivot(
                'registration_date',
                'status',
                'health_certificate_number',
                'health_certificate_expiry',
                'notes'
            )
            ->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(StampOrder::class);
    }

    public function stamps()
    {
        return $this->hasMany(Stamp::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}