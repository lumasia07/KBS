<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Approved</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

    <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
            alt="Kinshasa Bureau of Standards" style="max-width: 150px;">
    </div>

    <div
        style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #28a745;">
        <h2 style="color: #155724; margin: 0; font-size: 18px;">✅ Account Approved</h2>
    </div>

    <p><strong>Dear {{ $taxpayer->company_name }},</strong></p>

    <p>Your taxpayer registration has been <strong>approved</strong> by the Kinshasa Bureau of Standards.</p>

    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; font-size: 16px;">Account Status: <span style="color: #28a745;">ACTIVE</span></h3>
        <p><strong>Tax ID:</strong> {{ $taxpayer->tax_id_number ?? 'N/A' }}</p>
        <p><strong>Approved On:</strong> {{ date('F d, Y') }}</p>
    </div>

    <p>You can now:</p>
    <ul>
        <li>Submit order for product stamps</li>
        <li>Make online payments</li>
        <li>Access your dashboard</li>
    </ul>

    <div style="text-align: center; margin: 25px 0;">
        <a href="{{ $loginUrl ?? '#' }}"
            style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Login to Your Account
        </a>
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