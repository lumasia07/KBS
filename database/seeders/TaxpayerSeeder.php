<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Taxpayer;
use App\Models\User;
use App\Models\LegalForm;
use App\Models\BusinessSector;
use App\Models\CompanySize;
use Illuminate\Support\Str;

class TaxpayerSeeder extends Seeder
{
    public function run(): void
    {
        // Get required foreign keys
        $sarlForm = LegalForm::where('code', 'SARL')->first();
        $saForm = LegalForm::where('code', 'SA')->first();
        $retailSector = BusinessSector::where('code', 'RET')->first();
        $techSector = BusinessSector::where('code', 'TEC')->first();
        $mediumSize = CompanySize::where('category', 'Medium Enterprise')->first();
        $smallSize = CompanySize::where('category', 'Small Enterprise')->first();

        // Create test taxpayer company (use firstOrCreate to handle re-runs)
        $taxpayer = Taxpayer::firstOrCreate(
            ['email' => 'contact@sodeco.cd'],
            [
                'tax_identification_number' => 'TIN-2024-00001',
                'company_name' => 'SODECO SARL',
                'legal_form_id' => $sarlForm?->id,
                'sector_id' => $retailSector?->id,
                'company_size_id' => $mediumSize?->id,
                'trade_register_number' => 'RCCM/KIN/2024/B/00001',
                'trade_register_issue_date' => '2024-01-15',
                'physical_address' => '123 Avenue de la Liberation, Gombe, Kinshasa',
                'phone_number' => '+243810000001',
                'alternate_phone' => '+243820000001',
                'bank_name' => 'Rawbank',
                'bank_account_number' => 'RB-00012345678',
                'bank_account_holder' => 'SODECO SARL',
                'legal_representative_name' => 'Jean-Pierre Mukendi',
                'legal_representative_email' => 'jp.mukendi@sodeco.cd',
                'legal_representative_phone' => '+243810000002',
                'legal_representative_id_number' => 'ID-KIN-123456',
                'operational_contact_name' => 'Marie Kabongo',
                'operational_contact_email' => 'm.kabongo@sodeco.cd',
                'operational_contact_phone' => '+243810000003',
                'registration_status' => 'active',
                'registration_date' => '2024-01-15',
                'verification_date' => '2024-01-20',
                'api_key' => Str::random(64),
                'api_key_expires_at' => now()->addYear(),
            ]
        );

        // Create taxpayer user account linked to the taxpayer
        $taxpayerUser = User::firstOrCreate(
            ['email' => 'taxpayer@sodeco.cd'],
            [
                'first_name' => 'Jean-Pierre',
                'last_name' => 'Mukendi',
                'password' => bcrypt('Taxpayer@2024'),
                'phone_number' => '+243810000002',
                'user_type' => 'taxpayer',
                'taxpayer_id' => $taxpayer->id,
                'is_active' => true,
                'must_change_password' => false,
            ]
        );

        if (!$taxpayerUser->hasRole('Taxpayer User')) {
            $taxpayerUser->assignRole('Taxpayer User');
        }

        // Create second test taxpayer
        $taxpayer2 = Taxpayer::firstOrCreate(
            ['email' => 'info@congotech.cd'],
            [
                'tax_identification_number' => 'TIN-2024-00002',
                'company_name' => 'Congo Tech Solutions',
                'legal_form_id' => $saForm?->id ?? $sarlForm?->id,
                'sector_id' => $techSector?->id ?? $retailSector?->id,
                'company_size_id' => $smallSize?->id ?? $mediumSize?->id,
                'trade_register_number' => 'RCCM/KIN/2024/B/00002',
                'trade_register_issue_date' => '2024-02-10',
                'physical_address' => '456 Boulevard du 30 Juin, Gombe, Kinshasa',
                'phone_number' => '+243830000001',
                'bank_name' => 'Equity BCDC',
                'bank_account_number' => 'BCDC-00098765432',
                'bank_account_holder' => 'Congo Tech Solutions',
                'legal_representative_name' => 'Patrick Lumumba',
                'legal_representative_email' => 'p.lumumba@congotech.cd',
                'legal_representative_phone' => '+243830000002',
                'legal_representative_id_number' => 'ID-KIN-789012',
                'registration_status' => 'pending',
                'registration_date' => '2024-02-10',
                'api_key' => Str::random(64),
                'api_key_expires_at' => now()->addYear(),
            ]
        );

        // Create taxpayer user for second company
        $taxpayerUser2 = User::firstOrCreate(
            ['email' => 'taxpayer@congotech.cd'],
            [
                'first_name' => 'Patrick',
                'last_name' => 'Lumumba',
                'password' => bcrypt('Taxpayer@2024'),
                'phone_number' => '+243830000002',
                'user_type' => 'taxpayer',
                'taxpayer_id' => $taxpayer2->id,
                'is_active' => true,
                'must_change_password' => false,
            ]
        );

        if (!$taxpayerUser2->hasRole('Taxpayer User')) {
            $taxpayerUser2->assignRole('Taxpayer User');
        }
    }
}
