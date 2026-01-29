<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Taxpayer Registration Confirmation</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                padding: 15px !important;
            }
        }
    </style>
</head>

<body style="font-family: 'Arial', sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px;">

    <div class="container"
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">

        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <img src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
                alt="Kinshasa Bureau of Standards" style="max-width: 180px; height: auto;">
        </div>

        <!-- Main Content -->
        <h2 style="color: #2c3e50; margin-top: 0; font-size: 22px;">
            ✅ Taxpayer Registration Successful
        </h2>

        <p>Dear <strong>{{ $taxpayer->company_name }}</strong>,</p>

        <p>Thank you for registering with the Kinshasa Bureau of Standards. Your taxpayer account has been successfully
            created and is pending verification.</p>

        <div
            style="background-color: #f8f9fa; border-left: 4px solid #2c3e50; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #2c3e50; font-size: 16px;">Your Account Credentials</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; width: 120px;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0;">{{ $taxpayer->email }}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>Temporary Password:</strong></td>
                    <td style="padding: 8px 0;">
                        <code
                            style="background-color: #eee; padding: 4px 8px; border-radius: 3px; font-family: monospace;">
                            {{ $password }}
                        </code>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>API Key:</strong></td>
                    <td style="padding: 8px 0;">
                        <code
                            style="background-color: #eee; padding: 4px 8px; border-radius: 3px; font-family: monospace; word-break: break-all;">
                            {{ $taxpayer->api_key }}
                        </code>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>API Key Expiry:</strong></td>
                    <td style="padding: 8px 0;">{{ $taxpayer->api_key_expires_at }}</td>
                </tr>
            </table>
        </div>

        <!-- Important Notes Box -->
        <div
            style="background-color: #fff8e1; border: 1px solid #ffd54f; border-radius: 6px; padding: 16px; margin: 25px 0;">
            <h4 style="margin-top: 0; color: #e65100;">⚠️ Important Security Information</h4>
            <ul style="margin-bottom: 0; padding-left: 20px;">
                <li>Change your password immediately after first login</li>
                <li>Keep your API key confidential and never share it publicly</li>
                <li>Your account access will be activated after verification</li>
                <li>You will receive a separate notification once verification is complete</li>
            </ul>
        </div>

        <!-- Next Steps -->
        <div style="margin-top: 25px;">
            <h3 style="color: #2c3e50; font-size: 16px;">Next Steps</h3>
            <ol style="padding-left: 20px;">
                <li>Wait for account verification (you will be notified)</li>
                <li>Log in to your account once verified</li>
                <li>Update your password for security</li>
                <li>Start using your API key for integration</li>
            </ol>
        </div>

        <!-- Contact Information -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
            <p>Need assistance? Contact our support team:</p>
            <p>
                📧 <a href="mailto:support@kinshasabureau.gov"
                    style="color: #2c3e50;">support@kinshasabureau.gov</a><br>
                📞 +243 XX XXX XXXX
            </p>
        </div>

        <!-- Footer -->
        <div
            style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 13px;">
            <p style="margin-bottom: 5px;">
                <strong>Kinshasa Bureau of Standards</strong><br>
                Ministry of Finance, Democratic Republic of Congo
            </p>
            <p style="margin: 5px 0;">This is an automated message. Please do not reply to this email.</p>
            <p style="margin-top: 5px;">© {{ date('Y') }} Kinshasa Bureau of Standards. All rights reserved.</p>
        </div>

    </div>

</body>

</html>