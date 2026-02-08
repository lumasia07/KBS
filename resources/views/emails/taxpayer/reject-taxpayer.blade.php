<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Update</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

    <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
            alt="Kinshasa Bureau of Standards" style="max-width: 150px;">
    </div>

    <div
        style="background: #f8d7da; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #dc3545;">
        <h2 style="color: #721c24; margin: 0; font-size: 18px;">❌ Application Not Approved</h2>
    </div>

    <p><strong>Dear {{ $taxpayer->company_name }},</strong></p>

    <p>We regret to inform you that your taxpayer registration application <strong>was not approved</strong> at this
        time.</p>

    @if(!empty($rejectionReason))
        <div
            style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="margin-top: 0; font-size: 16px;">Reason:</h3>
            <p>{{ $rejectionReason }}</p>
        </div>
    @endif

    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; font-size: 16px;">Next Steps:</h3>
        <ol>
            <li>Address the issues mentioned above</li>
            <li>Gather required documents</li>
            <li>Reapply through our portal</li>
        </ol>
    </div>

    <div style="text-align: center; margin: 25px 0;">
        <a href="{{ $reapplyUrl ?? '#' }}"
            style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Reapply Now
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