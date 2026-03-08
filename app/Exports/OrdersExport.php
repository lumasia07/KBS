<?php

namespace App\Exports;

use App\Models\StampOrder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class OrdersExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = StampOrder::with(['taxpayer', 'product', 'stampType']);

        if (!empty($this->filters['date_from'])) {
            $query->whereDate('created_at', '>=', $this->filters['date_from']);
        }
        if (!empty($this->filters['date_to'])) {
            $query->whereDate('created_at', '<=', $this->filters['date_to']);
        }
        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        if (!empty($this->filters['taxpayer_id'])) {
            $query->where('taxpayer_id', $this->filters['taxpayer_id']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'Order Number',
            'Date',
            'Taxpayer',
            'Product',
            'Stamp Type',
            'Quantity',
            'Unit Price',
            'Total Amount',
            'Tax',
            'Penalty',
            'Grand Total',
            'Status'
        ];
    }

    public function map($order): array
    {
        return [
            $order->order_number,
            $order->created_at->format('Y-m-d H:i'),
            $order->taxpayer->company_name ?? 'N/A',
            $order->product->name ?? 'N/A',
            $order->stampType->name ?? 'N/A',
            $order->quantity,
            number_format($order->unit_price, 2),
            number_format($order->total_amount, 2),
            number_format($order->tax_amount, 2),
            number_format($order->penalty_amount, 2),
            number_format($order->grand_total, 2),
            ucfirst(str_replace('_', ' ', $order->status))
        ];
    }
}