<?php

namespace App\Exports;

use App\Models\Payment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PaymentsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Payment::with(['taxpayer', 'paymentMethod']);

        if (!empty($this->filters['date_from'])) {
            $query->whereDate('created_at', '>=', $this->filters['date_from']);
        }
        if (!empty($this->filters['date_to'])) {
            $query->whereDate('created_at', '<=', $this->filters['date_to']);
        }
        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        if (!empty($this->filters['payment_method_id'])) {
            $query->where('payment_method_id', $this->filters['payment_method_id']);
        }
        if (!empty($this->filters['taxpayer_id'])) {
            $query->where('taxpayer_id', $this->filters['taxpayer_id']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'Date',
            'Invoice Number',
            'Taxpayer',
            'Payment Method',
            'Amount',
            'Tax',
            'Penalty',
            'Total',
            'Status'
        ];
    }

    public function map($payment): array
    {
        return [
            $payment->created_at->format('Y-m-d H:i'),
            $payment->invoice_number,
            $payment->taxpayer->company_name ?? 'N/A',
            $payment->paymentMethod->name ?? 'N/A',
            number_format($payment->amount, 2),
            number_format($payment->tax_amount, 2),
            number_format($payment->penalty_amount, 2),
            number_format($payment->total_amount, 2),
            ucfirst($payment->status)
        ];
    }
}