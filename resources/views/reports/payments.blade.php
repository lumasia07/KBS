<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Payments Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th {
            background: #f0f0f0;
            font-weight: bold;
            text-align: left;
            padding: 8px;
            border: 1px solid #ddd;
        }

        td {
            padding: 6px;
            border: 1px solid #ddd;
        }

        .summary-box {
            background: #f9f9f9;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
        }

        .summary-item {
            display: inline-block;
            margin-right: 20px;
        }

        .text-right {
            text-align: right;
        }

        .status-pending {
            color: #856404;
            background: #fff3cd;
            padding: 2px 6px;
            border-radius: 3px;
        }

        .status-completed {
            color: #155724;
            background: #d4edda;
            padding: 2px 6px;
            border-radius: 3px;
        }

        .status-failed {
            color: #721c24;
            background: #f8d7da;
            padding: 2px 6px;
            border-radius: 3px;
        }
    </style>
</head>

<body>
    <div class="summary-box">
        <h3>Summary</h3>
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