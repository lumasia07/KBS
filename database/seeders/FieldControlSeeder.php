<?php

namespace Database\Seeders;

use App\Models\FieldControl;
use App\Models\User;
use App\Models\Taxpayer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FieldControlSeeder extends Seeder
{
    public function run(): void
    {
        // Get or create a control agent
        $agent = User::where('user_type', 'control_agent')->first();
        
        if (!$agent) {
            $agent = User::create([
                'name' => 'Agent Mbeki',
                'email' => 'agent@kbs.cd',
                'password' => bcrypt('password'),
                'user_type' => 'control_agent',
                'email_verified_at' => now(),
            ]);
        }

        // Get some taxpayers
        $taxpayers = Taxpayer::take(5)->get();

        $controlTypes = ['routine', 'targeted', 'complaint_based', 'random'];
        $statuses = ['completed', 'in_progress', 'requires_followup'];

        $sampleControls = [
            [
                'business_name' => 'SODECO SARL',
                'location_address' => 'Avenue Kasai 123, Gombe',
                'total_items_checked' => 50,
                'compliant_items' => 48,
                'non_compliant_items' => 2,
                'counterfeit_items' => 0,
                'status' => 'completed',
                'observations' => 'Business is well organized. Minor labeling issues found.',
            ],
            [
                'business_name' => 'Congo Tech Solutions',
                'location_address' => 'Rue de Commerce 45, Lingwala',
                'total_items_checked' => 30,
                'compliant_items' => 25,
                'non_compliant_items' => 3,
                'counterfeit_items' => 2,
                'status' => 'requires_followup',
                'observations' => 'Counterfeit stamps detected. Follow-up required.',
                'offence_declared' => true,
                'offence_description' => 'Two products with counterfeit quality stamps',
                'proposed_fine' => 500000,
            ],
            [
                'business_name' => 'BRACONGO',
                'location_address' => 'Avenue de la Paix 78, Limete',
                'total_items_checked' => 100,
                'compliant_items' => 98,
                'non_compliant_items' => 2,
                'counterfeit_items' => 0,
                'status' => 'completed',
                'observations' => 'Excellent compliance. All major products properly stamped.',
            ],
            [
                'business_name' => 'Mini Market Gombe',
                'location_address' => 'Avenue Colonel Ebeya, Gombe',
                'total_items_checked' => 20,
                'compliant_items' => 12,
                'non_compliant_items' => 5,
                'counterfeit_items' => 3,
                'status' => 'requires_followup',
                'observations' => 'High non-compliance rate. Multiple counterfeit products.',
                'offence_declared' => true,
                'offence_description' => 'Multiple counterfeit stamps on imported goods',
                'proposed_fine' => 750000,
            ],
            [
                'business_name' => 'Restaurant Le Chef',
                'location_address' => 'Boulevard du 30 Juin, Gombe',
                'total_items_checked' => 15,
                'compliant_items' => 15,
                'non_compliant_items' => 0,
                'counterfeit_items' => 0,
                'status' => 'completed',
                'observations' => 'Perfect compliance. All products verified.',
            ],
            [
                'business_name' => 'Pharmacie Centrale',
                'location_address' => 'Avenue Tombalbaye, Kinshasa',
                'total_items_checked' => 75,
                'compliant_items' => 70,
                'non_compliant_items' => 5,
                'counterfeit_items' => 0,
                'status' => 'in_progress',
                'observations' => 'Inspection ongoing. Some documentation pending.',
            ],
        ];

        $controlNumber = 1;
        foreach ($sampleControls as $sample) {
            $taxpayer = $taxpayers->random() ?? null;
            $ctrlNum = 'FC-' . date('Y') . '-' . str_pad($controlNumber, 4, '0', STR_PAD_LEFT);
            
            FieldControl::updateOrCreate(
                ['control_number' => $ctrlNum],
                [
                    'control_agent_id' => $agent->id,
                    'taxpayer_id' => $taxpayer?->id,
                    'business_name' => $sample['business_name'],
                    'location_address' => $sample['location_address'],
                    'latitude' => -4.3217 + (rand(-100, 100) / 1000),
                    'longitude' => 15.3125 + (rand(-100, 100) / 1000),
                    'control_type' => $controlTypes[array_rand($controlTypes)],
                    'control_date' => now()->subDays(rand(0, 7)),
                    'duration_minutes' => rand(30, 120),
                    'total_items_checked' => $sample['total_items_checked'],
                    'compliant_items' => $sample['compliant_items'],
                    'non_compliant_items' => $sample['non_compliant_items'],
                    'counterfeit_items' => $sample['counterfeit_items'],
                    'status' => $sample['status'],
                    'observations' => $sample['observations'],
                    'recommendations' => 'Continue regular monitoring.',
                    'offence_declared' => $sample['offence_declared'] ?? false,
                    'offence_description' => $sample['offence_description'] ?? null,
                    'proposed_fine' => $sample['proposed_fine'] ?? null,
                    'is_synced' => true,
                    'sync_date' => now(),
                ]
            );
            
            $controlNumber++;
        }

        $this->command->info('Created ' . count($sampleControls) . ' field control records.');
    }
}
