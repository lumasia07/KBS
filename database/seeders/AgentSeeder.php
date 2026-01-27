<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AgentSeeder extends Seeder
{
    public function run(): void
    {
        // Create field control agent 1 - Gombe District
        $agent1 = User::firstOrCreate(
            ['email' => 'agent.gombe@rcekin.cd'],
            [
                'first_name' => 'Emmanuel',
                'last_name' => 'Kasongo',
                'password' => bcrypt('Agent@2024'),
                'phone_number' => '+243810100001',
                'employee_id' => 'RCEKIN-AGT-001',
                'user_type' => 'control_agent',
                'department' => 'Field Operations',
                'position' => 'Field Control Agent - Gombe',
                'must_change_password' => false,
                'is_active' => true,
            ]
        );

        if (!$agent1->hasRole('Field Control Agent')) {
            $agent1->assignRole('Field Control Agent');
        }

        // Create field control agent 2 - Limete District
        $agent2 = User::firstOrCreate(
            ['email' => 'agent.limete@rcekin.cd'],
            [
                'first_name' => 'Grace',
                'last_name' => 'Mbuyi',
                'password' => bcrypt('Agent@2024'),
                'phone_number' => '+243810100002',
                'employee_id' => 'RCEKIN-AGT-002',
                'user_type' => 'control_agent',
                'department' => 'Field Operations',
                'position' => 'Field Control Agent - Limete',
                'must_change_password' => false,
                'is_active' => true,
            ]
        );

        if (!$agent2->hasRole('Field Control Agent')) {
            $agent2->assignRole('Field Control Agent');
        }

        // Create field control agent 3 - Ngaliema District
        $agent3 = User::firstOrCreate(
            ['email' => 'agent.ngaliema@rcekin.cd'],
            [
                'first_name' => 'Fiston',
                'last_name' => 'Kabila',
                'password' => bcrypt('Agent@2024'),
                'phone_number' => '+243810100003',
                'employee_id' => 'RCEKIN-AGT-003',
                'user_type' => 'control_agent',
                'department' => 'Field Operations',
                'position' => 'Field Control Agent - Ngaliema',
                'must_change_password' => false,
                'is_active' => true,
            ]
        );

        if (!$agent3->hasRole('Field Control Agent')) {
            $agent3->assignRole('Field Control Agent');
        }

        // Create senior field supervisor
        $supervisor = User::firstOrCreate(
            ['email' => 'supervisor.field@rcekin.cd'],
            [
                'first_name' => 'Robert',
                'last_name' => 'Tshisekedi',
                'password' => bcrypt('Supervisor@2024'),
                'phone_number' => '+243810100004',
                'employee_id' => 'RCEKIN-SUP-001',
                'user_type' => 'control_agent',
                'department' => 'Field Operations',
                'position' => 'Field Supervisor',
                'must_change_password' => false,
                'is_active' => true,
            ]
        );

        if (!$supervisor->hasRole('Field Control Agent')) {
            $supervisor->assignRole('Field Control Agent');
        }
    }
}
