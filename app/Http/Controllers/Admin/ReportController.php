<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\StampOrder;
use App\Models\Taxpayer;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Mpdf\Mpdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PaymentsExport;
use App\Exports\OrdersExport;
use App\Exports\TaxpayersExport;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/report/index', [
            'taxpayers' => Taxpayer::select('id', 'company_name', 'tax_identification_number')->get(),
            'paymentMethods' => PaymentMethod::select('id', 'name', 'code')->get(),
            'filters' => session('report_filters', [])
        ]);
    }

    public function generate(Request $request)
    {
        $filters = $request->validate([
            'report_type' => 'required|in:payments,orders,taxpayers',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'status' => 'nullable|string',
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'taxpayer_id' => 'nullable|exists:taxpayers,id',
        ]);

        session(['report_filters' => $filters]);

        $data = match ($filters['report_type']) {
            'payments' => $this->getPaymentsData($filters),
            'orders' => $this->getOrdersData($filters),
            'taxpayers' => $this->getTaxpayersData($filters),
        };

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function download(Request $request)
    {
        $filters = $request->validate([
            'report_type' => 'required|in:payments,orders,taxpayers',
            'format' => 'required|in:pdf,excel,csv',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'status' => 'nullable|string',
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'taxpayer_id' => 'nullable|exists:taxpayers,id',
        ]);

        $filename = $filters['report_type'] . '_report_' . now()->format('Ymd_His');

        return match ($filters['format']) {
            'pdf' => $this->downloadPDF($filters, $filename),
            'excel', 'csv' => $this->downloadExcel($filters, $filename),
        };
    }

    private function downloadPDF($filters, $filename)
    {
        $data = match ($filters['report_type']) {
            'payments' => $this->getPaymentsData($filters),
            'orders' => $this->getOrdersData($filters),
            'taxpayers' => $this->getTaxpayersData($filters),
        };

        $html = view('reports.' . $filters['report_type'], [
            'data' => $data,
            'filters' => $filters,
            'generated_at' => now()->format('Y-m-d H:i:s')
        ])->render();

        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 16,
            'margin_bottom' => 16,
            'margin_header' => 9,
            'margin_footer' => 9
        ]);

        $mpdf->SetHTMLHeader('
            <div style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                <table style="width: 100%;">
                    <tr>
                        <td style="font-size: 20px; font-weight: bold;">' . ucfirst($filters['report_type']) . ' Report</td>
                        <td style="text-align: right; font-size: 10px;">Generated: ' . now()->format('Y-m-d H:i:s') . '</td>
                    </tr>
                </table>
            </div>
        ');

        $mpdf->SetHTMLFooter('
            <div style="border-top: 1px solid #ddd; padding-top: 5px; font-size: 10px; text-align: center;">
                Page {PAGENO} of {nbpg}
            </div>
        ');

        $mpdf->WriteHTML($html);
        return $mpdf->Output($filename . '.pdf', 'D');
    }

    private function downloadExcel($filters, $filename)
    {
        $export = match ($filters['report_type']) {
            'payments' => new PaymentsExport($filters),
            'orders' => new OrdersExport($filters),
            'taxpayers' => new TaxpayersExport($filters),
        };

        $extension = $filters['format'] === 'excel' ? 'xlsx' : 'csv';
        return Excel::download($export, $filename . '.' . $extension);
    }

    private function getPaymentsData($filters)
    {
        $query = Payment::with(['taxpayer', 'paymentMethod']);

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['payment_method_id'])) {
            $query->where('payment_method_id', $filters['payment_method_id']);
        }
        if (!empty($filters['taxpayer_id'])) {
            $query->where('taxpayer_id', $filters['taxpayer_id']);
        }

        $payments = $query->orderBy('created_at', 'desc')->get();

        return [
            'records' => $payments,
            'summary' => [
                'total_payments' => $payments->count(),
                'total_amount' => $payments->sum('amount'),
                'total_tax' => $payments->sum('tax_amount'),
                'total_penalty' => $payments->sum('penalty_amount'),
                'grand_total' => $payments->sum('total_amount'),
                'by_status' => $payments->groupBy('status')->map->count()
            ]
        ];
    }

    private function getOrdersData($filters)
    {
        $query = StampOrder::with(['taxpayer', 'product', 'stampType']);

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['taxpayer_id'])) {
            $query->where('taxpayer_id', $filters['taxpayer_id']);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        return [
            'records' => $orders,
            'summary' => [
                'total_orders' => $orders->count(),
                'total_quantity' => $orders->sum('quantity'),
                'grand_total' => $orders->sum('grand_total'),
                'by_status' => $orders->groupBy('status')->map->count()
            ]
        ];
    }

    private function getTaxpayersData($filters)
    {
        $query = Taxpayer::with(['legalForm', 'sector', 'companySize']);

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }
        if (!empty($filters['status'])) {
            $query->where('registration_status', $filters['status']);
        }

        $taxpayers = $query->orderBy('created_at', 'desc')->get();

        return [
            'records' => $taxpayers,
            'summary' => [
                'total_taxpayers' => $taxpayers->count(),
                'by_status' => $taxpayers->groupBy('registration_status')->map->count(),
                'by_sector' => $taxpayers->groupBy('sector.name')->map->count()
            ]
        ];
    }
}