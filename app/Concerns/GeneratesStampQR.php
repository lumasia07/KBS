<?php

namespace App\Concerns;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;

trait GeneratesStampQR
{
    /**
     * Generate QR code data for a stamp
     */
    protected function generateQRData(string $serialNumber): array
    {
        // Generate unique identifiers
        $uuid = Str::uuid()->toString();
        $timestamp = time();

        // Create verification token
        $verificationToken = hash_hmac('sha256', $serialNumber . $uuid, config('app.key'));

        // Prepare payload
        $payload = [
            'v' => 1, // Version
            'sn' => $serialNumber,
            'ts' => $timestamp,
            'uid' => $uuid,
            'vt' => substr($verificationToken, 0, 8),
        ];

        // Generate QR code (multiple layers of security)
        $qrLayers = [
            'public' => base64_encode(json_encode([
                'sn' => $serialNumber,
                'vt' => substr($verificationToken, 0, 8),
            ])),
            'secure' => Crypt::encryptString(json_encode([
                'uid' => $uuid,
                'ts' => $timestamp,
            ])),
        ];

        // Create final QR code
        $qrCode = json_encode([
            'p' => $qrLayers['public'],
            's' => $qrLayers['secure'],
            'h' => hash('sha256', $serialNumber . $uuid . $timestamp),
        ]);

        return [
            'qr_code' => $qrCode,
            'verification_token' => $verificationToken,
            'uuid' => $uuid,
        ];
    }
}