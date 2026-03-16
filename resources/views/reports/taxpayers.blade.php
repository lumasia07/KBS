<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Taxpayers Report</title>
    <link rel="stylesheet" href="{{ public_path('css/report.css') }}">
</head>

<body>
    <div class="summary-box">
        <div class="summary-item">Total Taxpayers: {{ $data['summary']['total_taxpayers'] }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>TIN</th>
                <th>Company Name</th>
                <th>Legal Form</th>
                <th>Sector</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Registration Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['records'] as $taxpayer)
                <tr>
                    <td>{{ $taxpayer->tax_identification_number }}</td>
                    <td>{{ $taxpayer->company_name }}</td>
                    <td>{{ $taxpayer->legalForm->name ?? 'N/A' }}</td>
                    <td>{{ $taxpayer->sector->name ?? 'N/A' }}</td>
                    <td>{{ $taxpayer->email }}</td>
                    <td>{{ $taxpayer->phone_number }}</td>
                    <td>{{ ucfirst($taxpayer->registration_status) }}</td>
                    <td>{{ $taxpayer->created_at->format('Y-m-d') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>