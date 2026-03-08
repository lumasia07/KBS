<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Taxpayers Report</title>
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