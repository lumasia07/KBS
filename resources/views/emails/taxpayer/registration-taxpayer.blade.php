<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

    <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
            alt="Kinshasa Bureau of Standards" style="max-width: 150px;">
    </div>

    <div
        style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
        <h2 style="color: #1565c0; margin: 0; font-size: 18px;">📝 Registration Received</h2>
    </div>

    <p><strong>Dear {{ $taxpayer->company_name }},</strong></p>

    <p>Your taxpayer registration has been received and is <strong>pending verification</strong>.</p>

    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; font-size: 16px;">Your Login Details</h3>
        <p><strong>Email:</strong> {{ $taxpayer->email }}</p>
        <p><strong>Password:</strong> <code
                style="background: #eee; padding: 3px 8px; border-radius: 3px;">{{ $password }}</code></p>
        <p><strong>Status:</strong> <span style="color: #ff9800;">Pending Verification</span></p>
    </div>

    <div
        style="background: #fff8e1; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ff9800;">
        <h4 style="margin-top: 0; font-size: 14px;">🔒 Important</h4>
        <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px;">
            <li>Change password after first login</li>
            <li>Account activates after verification</li>
            <li>You'll be notified once verified</li>
        </ul>
    </div>

    <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
        <p><strong>For assistance:</strong><br>
            📧 support@kinshasabureau.gov<br>
            📞 +243 XX XXX XXXX</p>

        <p style="font-size: 12px; text-align: center; margin-top: 20px;">
            © {{ date('Y') }} Kinshasa Bureau of Standards
        </p>
    </div>

</body>

</html>