<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Payments Report</title>
    <link rel="stylesheet" href="{{ public_path('css/report.css') }}">
</head>

<body>
    <div class="summary-box">
        <div class="summary-item">Total Payments: {{ $data['summary']['total_payments'] }}</div>
        <div class="summary-item">Total Amount: {{ number_format($data['summary']['grand_total'], 2) }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Invoice #</th>
                <th>Taxpayer</th>
                <th>Method</th>
                <th class="text-right">Amount</th>
                <th class="text-right">Tax</th>
                <th class="text-right">Total</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['records'] as $payment)
                <tr>
                    <td>{{ $payment->created_at->format('Y-m-d H:i') }}</td>
                    <td>{{ $payment->invoice_number }}</td>
                    <td>{{ $payment->taxpayer->company_name ?? 'N/A' }}</td>
                    <td>{{ $payment->paymentMethod->name ?? 'N/A' }}</td>
                    <td class="text-right">{{ number_format($payment->amount, 2) }}</td>
                    <td class="text-right">{{ number_format($payment->tax_amount, 2) }}</td>
                    <td class="text-right">{{ number_format($payment->total_amount, 2) }}</td>
                    <td>
                        <span class="status-{{ $payment->status }}">{{ ucfirst($payment->status) }}</span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>