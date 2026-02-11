<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Taxpayer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoTaxpayerSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create the Taxpayer profile first to get the ID
        $taxpayer = Taxpayer::firstOrCreate(
            ['email' => 'demo.taxpayer@kbs.cd'],
            [
                'company_name' => 'Demo Company Ltd',
                'tax_identification_number' => 'TIM-DEMO-2026',
                'trade_register_number' => 'RCCM/KIN/KG/12345',
                'physical_address' => '123 Demo Street, Kinshasa',
                'legal_form_id' => 7,
                'district_id' => 1,
                'sector_id' => 1,
                'company_size_id' => 8,
                'commune_id' => 1,
                'quartier_id' => 165,
                'email' => 'demo.taxpayer@kbs.cd',
                'phone_number' => '+243999999999',
                'legal_representative_name' => 'Demo Rep',
                'legal_representative_email' => 'rep@kbs.cd',
                'legal_representative_phone' => '+243888888888',
                'legal_representative_id_number' => 'ID123456',
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'registration_status' => 'pending',
                'registration_date' => now(),
            ]
        );

        // 2. Create the User linked to the Taxpayer
        $user = User::firstOrCreate(
            ['email' => 'demo.taxpayer@kbs.cd'],
            [
                'first_name' => 'Demo',
                'last_name' => 'Taxpayer',
                'password' => Hash::make('Demo@2024'),
                'user_type' => 'taxpayer',
                'taxpayer_id' => $taxpayer->id,
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        $this->command->info('Demo Taxpayer created: demo.taxpayer@kbs.cd / Demo@2024');
    }
}
