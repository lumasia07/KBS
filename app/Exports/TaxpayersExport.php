<?php

namespace App\Exports;

use App\Models\Taxpayer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TaxpayersExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Taxpayer::with(['legalForm', 'sector', 'companySize']);

        if (!empty($this->filters['date_from'])) {
            $query->whereDate('created_at', '>=', $this->filters['date_from']);
        }
        if (!empty($this->filters['date_to'])) {
            $query->whereDate('created_at', '<=', $this->filters['date_to']);
        }
        if (!empty($this->filters['status'])) {
            $query->where('registration_status', $this->filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'TIN',
            'Company Name',
            'Legal Form',
            'Sector',
            'Size',
            'Email',
            'Phone',
            'Status',
            'Registration Date',
            'Products Count'
        ];
    }

    public function map($taxpayer): array
    {
        return [
            $taxpayer->tax_identification_number,
            $taxpayer->company_name,
            $taxpayer->legalForm->name ?? 'N/A',
            $taxpayer->sector->name ?? 'N/A',
            $taxpayer->companySize->name ?? 'N/A',
            $taxpayer->email,
            $taxpayer->phone_number,
            ucfirst($taxpayer->registration_status),
            $taxpayer->created_at->format('Y-m-d'),
            $taxpayer->products()->count()
        ];
    }
}