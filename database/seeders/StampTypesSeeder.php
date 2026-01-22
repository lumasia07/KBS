<?php

namespace Database\Seeders;

use App\Models\StampType;
use Illuminate\Database\Seeder;

class StampTypesSeeder extends Seeder
{
    public function run()
    {
        $stampTypes = [
            [
                'code' => 'QR_STANDARD',
                'name' => 'QR Code Standard',
                'technology' => 'qr_code',
                'description' => 'Standard QR code stamp with basic authentication features',
                'security_features' => 'QR encryption, unique serial number, tamper evidence',
                'unit_cost' => 1500.00,
                'is_active' => true,
            ],
            [
                'code' => 'QR_PREMIUM',
                'name' => 'QR Code Premium',
                'technology' => 'qr_code',
                'description' => 'Advanced QR code with enhanced security features',
                'security_features' => 'Dynamic QR, geolocation tracking, multi-layer encryption',
                'unit_cost' => 2500.00,
                'is_active' => true,
            ],
            [
                'code' => 'HOLO_STANDARD',
                'name' => 'Hologram Standard',
                'technology' => 'hologram',
                'description' => 'Standard holographic security stamp',
                'security_features' => '3D hologram, color shifting, hidden images',
                'unit_cost' => 3000.00,
                'is_active' => true,
            ],
            [
                'code' => 'HOLO_ADVANCED',
                'name' => 'Hologram Advanced',
                'technology' => 'hologram',
                'description' => 'Advanced hologram with multiple security layers',
                'security_features' => 'Kinetic hologram, microtext, UV features, nano-text',
                'unit_cost' => 4500.00,
                'is_active' => true,
            ],
            [
                'code' => 'RFID_BASIC',
                'name' => 'RFID Basic',
                'technology' => 'rfid',
                'description' => 'Basic RFID-enabled stamp for tracking',
                'security_features' => 'RFID chip, unique ID, read/write capability',
                'unit_cost' => 5000.00,
                'is_active' => true,
            ],
            [
                'code' => 'RFID_SECURE',
                'name' => 'RFID Secure',
                'technology' => 'rfid',
                'description' => 'Secure RFID stamp with encryption',
                'security_features' => 'Encrypted RFID, anti-cloning, proximity detection',
                'unit_cost' => 7500.00,
                'is_active' => true,
            ],
            [
                'code' => 'DIGITAL_CODE',
                'name' => 'Digital Code',
                'technology' => 'digital_code',
                'description' => 'Stamp with unique digital verification code',
                'security_features' => '16-digit unique code, online verification, expiry tracking',
                'unit_cost' => 1000.00,
                'is_active' => true,
            ],
            [
                'code' => 'DIGITAL_2FA',
                'name' => 'Digital 2FA',
                'technology' => 'digital_code',
                'description' => 'Two-factor authentication digital stamp',
                'security_features' => 'Time-based codes, SMS verification, mobile app integration',
                'unit_cost' => 2000.00,
                'is_active' => true,
            ],
            [
                'code' => 'SEC_PAPER_BASIC',
                'name' => 'Security Paper Basic',
                'technology' => 'security_paper',
                'description' => 'Stamp printed on basic security paper',
                'security_features' => 'Watermark, security fibers, chemical sensitivity',
                'unit_cost' => 800.00,
                'is_active' => true,
            ],
            [
                'code' => 'SEC_PAPER_PREMIUM',
                'name' => 'Security Paper Premium',
                'technology' => 'security_paper',
                'description' => 'Premium security paper with multiple features',
                'security_features' => 'Multi-tone watermark, UV fibers, iridescent coating, micro-perforation',
                'unit_cost' => 1500.00,
                'is_active' => true,
            ],
            [
                'code' => 'HYBRID_QR_HOLO',
                'name' => 'Hybrid QR-Hologram',
                'technology' => 'qr_code',
                'description' => 'Combination of QR code and hologram technology',
                'security_features' => 'QR code with holographic overlay, dual verification',
                'unit_cost' => 4000.00,
                'is_active' => true,
            ],
            [
                'code' => 'SMART_STAMP',
                'name' => 'Smart Stamp',
                'technology' => 'rfid',
                'description' => 'Intelligent stamp with multiple technologies',
                'security_features' => 'RFID + QR + Hologram, NFC enabled, real-time tracking',
                'unit_cost' => 10000.00,
                'is_active' => true,
            ],
            [
                'code' => 'ECO_STAMP',
                'name' => 'Eco-Friendly Stamp',
                'technology' => 'security_paper',
                'description' => 'Environmentally friendly security stamp',
                'security_features' => 'Recycled security paper, biodegradable materials',
                'unit_cost' => 1200.00,
                'is_active' => true,
            ],
            [
                'code' => 'TEMPORARY',
                'name' => 'Temporary Stamp',
                'technology' => 'digital_code',
                'description' => 'Short-term validity stamp for temporary permits',
                'security_features' => '30-day validity, single-use code',
                'unit_cost' => 500.00,
                'is_active' => true,
            ],
            [
                'code' => 'ANNUAL_PASS',
                'name' => 'Annual Pass Stamp',
                'technology' => 'qr_code',
                'description' => 'Annual validation stamp with renewal tracking',
                'security_features' => '365-day validity, renewal reminders, usage tracking',
                'unit_cost' => 6000.00,
                'is_active' => true,
            ],
        ];

        foreach ($stampTypes as $stampType) {
            StampType::create($stampType);
        }
    }
}