<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Taxpayer;

class TaxpayerUserSeeder extends Seeder
{
    public function run(): void
    {
        // Get or create a sample taxpayer
        $taxpayer = Taxpayer::first();
        
        if (!$taxpayer) {
            $this->command->warn('No taxpayers found. Please seed taxpayers first.');
            return;
        }

        // Create demo taxpayer user with proper linkage
        // Note: User model has 'password' => 'hashed' cast, so we pass plain text password
        $demoTaxpayer = User::updateOrCreate(
            ['email' => 'demo.taxpayer@kbs.cd'],
            [
                'first_name' => 'Demo',
                'last_name' => 'Taxpayer',
                'password' => 'Demo@2024',  // Plain text - model will hash it
                'phone_number' => '+243999888777',
                'user_type' => 'taxpayer',
                'taxpayer_id' => $taxpayer->id,
                'department' => 'Management',
                'position' => 'Director',
                'must_change_password' => false,
                'is_active' => true,
            ]
        );

        // Ensure correct role
        $demoTaxpayer->syncRoles(['Taxpayer User']);

        $this->command->info('✅ Demo taxpayer user created:');
        $this->command->info('   Email: demo.taxpayer@kbs.cd');
        $this->command->info('   Password: Demo@2024');
        $this->command->info('   Linked to: ' . $taxpayer->company_name);
    }
}
