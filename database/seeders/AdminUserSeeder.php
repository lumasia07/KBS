<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create super admin user
        $superAdmin = User::create([
            'first_name' => 'Super',
            'last_name' => 'Administrator',
            'email' => 'superadmin@rcekin.cd',
            'password' => bcrypt('Rcekin@2024'),
            'phone_number' => '+243000000001',
            'employee_id' => 'RCEKIN-001',
            'user_type' => 'admin',
            'department' => 'Administration',
            'position' => 'Super Administrator',
            'must_change_password' => true,
            'is_active' => true,
        ]);

        $superAdmin->assignRole('Super Administrator');

        // Create system administrator
        $systemAdmin = User::create([
            'first_name' => 'System',
            'last_name' => 'Admin',
            'email' => 'admin@rcekin.cd',
            'password' => bcrypt('Admin@2024'),
            'phone_number' => '+243000000002',
            'employee_id' => 'RCEKIN-002',
            'user_type' => 'admin',
            'department' => 'IT Department',
            'position' => 'System Administrator',
            'must_change_password' => true,
            'is_active' => true,
        ]);

        $systemAdmin->assignRole('System Administrator');

        // Create registration officer
        $regOfficer = User::create([
            'first_name' => 'John',
            'last_name' => 'Registration',
            'email' => 'registration@rcekin.cd',
            'password' => bcrypt('Registration@2024'),
            'phone_number' => '+243000000003',
            'employee_id' => 'RCEKIN-003',
            'user_type' => 'admin',
            'department' => 'Registration',
            'position' => 'Registration Officer',
            'must_change_password' => true,
            'is_active' => true,
        ]);

        $regOfficer->assignRole('Registration Officer');

        // Create field control agent
        $controlAgent = User::create([
            'first_name' => 'Field',
            'last_name' => 'Agent',
            'email' => 'field.agent@rcekin.cd',
            'password' => bcrypt('Field@2024'),
            'phone_number' => '+243000000004',
            'employee_id' => 'RCEKIN-004',
            'user_type' => 'control_agent',
            'department' => 'Field Operations',
            'position' => 'Field Control Agent',
            'municipality_id' => 1, // Assuming first municipality
            'must_change_password' => true,
            'is_active' => true,
        ]);

        $controlAgent->assignRole('Field Control Agent');

        // Create finance officer
        $financeOfficer = User::create([
            'first_name' => 'Finance',
            'last_name' => 'Officer',
            'email' => 'finance@rcekin.cd',
            'password' => bcrypt('Finance@2024'),
            'phone_number' => '+243000000005',
            'employee_id' => 'RCEKIN-005',
            'user_type' => 'finance',
            'department' => 'Finance',
            'position' => 'Finance Officer',
            'must_change_password' => true,
            'is_active' => true,
        ]);

        $financeOfficer->assignRole('Finance Officer');
    }
}