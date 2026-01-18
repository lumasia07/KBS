<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Report extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'report_code',
        'title',
        'report_type',
        'parameters',
        'start_date',
        'end_date',
        'sector_id',
        'municipality_id',
        'generated_by',
        'status',
        'pdf_path',
        'excel_path',
        'chart_data',
        'total_orders',
        'total_revenue',
        'total_taxpayers',
        'total_controls',
        'total_complaints',
        'compliance_rate'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'parameters' => 'array',
        'chart_data' => 'array',
        'total_orders' => 'integer',
        'total_revenue' => 'decimal:2',
        'total_taxpayers' => 'integer',
        'total_controls' => 'integer',
        'total_complaints' => 'integer',
        'compliance_rate' => 'decimal:2'
    ];

    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function sector()
    {
        return $this->belongsTo(BusinessSector::class, 'sector_id');
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function isGenerating()
    {
        return $this->status === 'generating';
    }

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isFailed()
    {
        return $this->status === 'failed';
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('report_type', $type);
    }

    public function scopeByPeriod($query, $startDate, $endDate)
    {
        return $query->where('start_date', '>=', $startDate)
            ->where('end_date', '<=', $endDate);
    }

    public function getReportPeriodAttribute()
    {
        if ($this->start_date && $this->end_date) {
            return "{$this->start_date->format('Y-m-d')} to {$this->end_date->format('Y-m-d')}";
        }
        return 'N/A';
    }

    public function getDownloadLinksAttribute()
    {
        $links = [];

        if ($this->pdf_path) {
            $links['pdf'] = $this->pdf_path;
        }

        if ($this->excel_path) {
            $links['excel'] = $this->excel_path;
        }

        return $links;
    }
}