<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Orders Report</title>
    <link rel="stylesheet" href="{{ public_path('css/report.css') }}">
</head>

<body>
    <div class="summary-box">
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