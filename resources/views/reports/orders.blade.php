<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Orders Report</title>
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
    </style>
</head>

<body>
    <div class="summary-box">
        <h3>Summary</h3>
        <div class="summary-item">Total Orders: {{ $data['summary']['total_orders'] }}</div>
        <div class="summary-item">Total Quantity: {{ number_format($data['summary']['total_quantity']) }}</div>
        <div class="summary-item">Grand Total: {{ number_format($data['summary']['grand_total'], 2) }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Taxpayer</th>
                <th>Product</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['records'] as $order)
                <tr>
                    <td>{{ $order->order_number }}</td>
                    <td>{{ $order->created_at->format('Y-m-d H:i') }}</td>
                    <td>{{ $order->taxpayer->company_name ?? 'N/A' }}</td>
                    <td>{{ $order->product->name ?? 'N/A' }}</td>
                    <td class="text-right">{{ number_format($order->quantity) }}</td>
                    <td class="text-right">{{ number_format($order->unit_price, 2) }}</td>
                    <td class="text-right">{{ number_format($order->grand_total, 2) }}</td>
                    <td>{{ ucfirst(str_replace('_', ' ', $order->status)) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>