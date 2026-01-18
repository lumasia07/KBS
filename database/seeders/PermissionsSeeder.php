<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions for WEB guard (default)
        $this->createWebPermissions();

        // Create permissions for API guard
        $this->createApiPermissions();

        // Create roles and assign permissions
        $this->createRoles();
    }

    protected function createWebPermissions(): void
    {
        // Module 1: Taxpayer Registration
        Permission::create(['name' => 'view_taxpayers', 'guard_name' => 'web']);
        Permission::create(['name' => 'create_taxpayers', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit_taxpayers', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete_taxpayers', 'guard_name' => 'web']);
        Permission::create(['name' => 'verify_taxpayers', 'guard_name' => 'web']);
        Permission::create(['name' => 'suspend_taxpayers', 'guard_name' => 'web']);
        Permission::create(['name' => 'export_taxpayers', 'guard_name' => 'web']);

        // Module 2: Stamp Order Management
        Permission::create(['name' => 'view_orders', 'guard_name' => 'web']);
        Permission::create(['name' => 'create_orders', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit_orders', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete_orders', 'guard_name' => 'web']);
        Permission::create(['name' => 'approve_orders', 'guard_name' => 'web']);
        Permission::create(['name' => 'reject_orders', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_all_orders', 'guard_name' => 'web']);
        Permission::create(['name' => 'export_orders', 'guard_name' => 'web']);

        // Module 3: Payment Management
        Permission::create(['name' => 'view_payments', 'guard_name' => 'web']);
        Permission::create(['name' => 'confirm_payments', 'guard_name' => 'web']);
        Permission::create(['name' => 'refund_payments', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_all_payments', 'guard_name' => 'web']);
        Permission::create(['name' => 'export_payments', 'guard_name' => 'web']);
        Permission::create(['name' => 'generate_invoices', 'guard_name' => 'web']);

        // Module 4: Stamp Management
        Permission::create(['name' => 'view_stamps', 'guard_name' => 'web']);
        Permission::create(['name' => 'create_stamps', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit_stamps', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete_stamps', 'guard_name' => 'web']);
        Permission::create(['name' => 'activate_stamps', 'guard_name' => 'web']);
        Permission::create(['name' => 'void_stamps', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage_stamp_loss', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_stamp_reports', 'guard_name' => 'web']);

        // Module 5: Field Control
        Permission::create(['name' => 'conduct_controls', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_controls', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit_controls', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete_controls', 'guard_name' => 'web']);
        Permission::create(['name' => 'approve_controls', 'guard_name' => 'web']);
        Permission::create(['name' => 'declare_offences', 'guard_name' => 'web']);
        Permission::create(['name' => 'impose_fines', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_all_controls', 'guard_name' => 'web']);
        Permission::create(['name' => 'export_controls', 'guard_name' => 'web']);
        Permission::create(['name' => 'scan_stamps', 'guard_name' => 'web']);

        // Module 6: Complaints Management
        Permission::create(['name' => 'view_complaints', 'guard_name' => 'web']);
        Permission::create(['name' => 'create_complaints', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit_complaints', 'guard_name' => 'web']);
        Permission::create(['name' => 'assign_complaints', 'guard_name' => 'web']);
        Permission::create(['name' => 'resolve_complaints', 'guard_name' => 'web']);
        Permission::create(['name' => 'escalate_complaints', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_all_complaints', 'guard_name' => 'web']);

        // Module 7: Reporting & Analytics
        Permission::create(['name' => 'view_reports', 'guard_name' => 'web']);
        Permission::create(['name' => 'generate_reports', 'guard_name' => 'web']);
        Permission::create(['name' => 'export_reports', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_dashboards', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_analytics', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_statistics', 'guard_name' => 'web']);

        // Module 8: System Administration
        Permission::create(['name' => 'manage_users', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage_roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage_permissions', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage_settings', 'guard_name' => 'web']);
        Permission::create(['name' => 'view_audit_logs', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage_api_keys', 'guard_name' => 'web']);
        Permission::create(['name' => 'system_maintenance', 'guard_name' => 'web']);

        // Module 9: Configuration Management
        Permission::create(['name' => 'manage_products', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage_sectors', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage_municipalities', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage_stamp_types', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage_tariffs', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage_tax_rates', 'guard_name' => 'web']);
    }

    protected function createApiPermissions(): void
    {
        // API-specific permissions (subset of web permissions)
        Permission::create(['name' => 'api_view_taxpayers', 'guard_name' => 'api']);
        Permission::create(['name' => 'api_create_orders', 'guard_name' => 'api']);
        Permission::create(['name' => 'api_view_orders', 'guard_name' => 'api']);
        Permission::create(['name' => 'api_view_payments', 'guard_name' => 'api']);
        Permission::create(['name' => 'api_scan_stamps', 'guard_name' => 'api']);
        Permission::create(['name' => 'api_conduct_controls', 'guard_name' => 'api']);
        Permission::create(['name' => 'api_view_controls', 'guard_name' => 'api']);
        Permission::create(['name' => 'api_sync_offline', 'guard_name' => 'api']);
    }

    protected function createRoles(): void
    {
        // Super Administrator - Has all WEB permissions
        $superAdmin = Role::create(['name' => 'Super Administrator', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo(Permission::where('guard_name', 'web')->get());

        // System Administrator
        $systemAdmin = Role::create(['name' => 'System Administrator', 'guard_name' => 'web']);
        $systemAdmin->givePermissionTo([
            'manage_users',
            'manage_roles',
            'manage_permissions',
            'manage_settings',
            'view_audit_logs',
            'manage_api_keys',
            'system_maintenance',
            'view_reports',
            'generate_reports',
            'view_dashboards',
            'view_analytics',
        ]);

        // Registration Officer
        $registrationOfficer = Role::create(['name' => 'Registration Officer', 'guard_name' => 'web']);
        $registrationOfficer->givePermissionTo([
            'view_taxpayers',
            'create_taxpayers',
            'edit_taxpayers',
            'verify_taxpayers',
            'export_taxpayers',
            'view_reports',
        ]);

        // Order Processing Officer
        $orderOfficer = Role::create(['name' => 'Order Processing Officer', 'guard_name' => 'web']);
        $orderOfficer->givePermissionTo([
            'view_orders',
            'create_orders',
            'edit_orders',
            'approve_orders',
            'reject_orders',
            'view_all_orders',
            'export_orders',
            'view_payments',
            'generate_invoices',
        ]);

        // Finance Officer
        $financeOfficer = Role::create(['name' => 'Finance Officer', 'guard_name' => 'web']);
        $financeOfficer->givePermissionTo([
            'view_payments',
            'confirm_payments',
            'refund_payments',
            'view_all_payments',
            'export_payments',
            'generate_invoices',
            'view_reports',
            'export_reports',
            'view_dashboards',
        ]);

        // Stamp Production Manager
        $stampManager = Role::create(['name' => 'Stamp Production Manager', 'guard_name' => 'web']);
        $stampManager->givePermissionTo([
            'view_stamps',
            'create_stamps',
            'edit_stamps',
            'activate_stamps',
            'void_stamps',
            'manage_stamp_loss',
            'view_stamp_reports',
            'view_reports',
            'export_reports',
        ]);

        // Field Control Agent
        $controlAgent = Role::create(['name' => 'Field Control Agent', 'guard_name' => 'web']);
        $controlAgent->givePermissionTo([
            'conduct_controls',
            'view_controls',
            'edit_controls',
            'declare_offences',
            'scan_stamps',
            'view_taxpayers',
        ]);

        // Field Control Supervisor
        $controlSupervisor = Role::create(['name' => 'Field Control Supervisor', 'guard_name' => 'web']);
        $controlSupervisor->givePermissionTo([
            'view_controls',
            'edit_controls',
            'approve_controls',
            'impose_fines',
            'view_all_controls',
            'export_controls',
            'view_taxpayers',
            'view_reports',
            'generate_reports',
        ]);

        // Complaints Officer
        $complaintsOfficer = Role::create(['name' => 'Complaints Officer', 'guard_name' => 'web']);
        $complaintsOfficer->givePermissionTo([
            'view_complaints',
            'create_complaints',
            'edit_complaints',
            'assign_complaints',
            'resolve_complaints',
            'escalate_complaints',
            'view_all_complaints',
        ]);

        // Reporting Analyst
        $reportingAnalyst = Role::create(['name' => 'Reporting Analyst', 'guard_name' => 'web']);
        $reportingAnalyst->givePermissionTo([
            'view_reports',
            'generate_reports',
            'export_reports',
            'view_dashboards',
            'view_analytics',
            'view_statistics',
            'view_taxpayers',
            'view_orders',
            'view_payments',
            'view_controls',
        ]);

        // Configuration Manager
        $configManager = Role::create(['name' => 'Configuration Manager', 'guard_name' => 'web']);
        $configManager->givePermissionTo([
            'manage_products',
            'manage_sectors',
            'manage_municipalities',
            'manage_stamp_types',
            'manage_tariffs',
            'manage_tax_rates',
            'view_reports',
        ]);

        // Taxpayer User Role (WEB)
        $taxpayerUser = Role::create(['name' => 'Taxpayer User', 'guard_name' => 'web']);
        $taxpayerUser->givePermissionTo([
            'view_taxpayers',
            'edit_taxpayers',
            'view_orders',
            'create_orders',
            'edit_orders',
            'view_payments',
            'view_stamps',
            'create_complaints',
            'view_complaints',
        ]);

        // API User Role (API Guard)
        $apiUser = Role::create(['name' => 'API User', 'guard_name' => 'api']);
        $apiUser->givePermissionTo([
            'api_view_taxpayers',
            'api_create_orders',
            'api_view_orders',
            'api_view_payments',
        ]);

        // Mobile App Role (API Guard for field agents)
        $mobileAppUser = Role::create(['name' => 'Mobile App User', 'guard_name' => 'api']);
        $mobileAppUser->givePermissionTo([
            'api_scan_stamps',
            'api_conduct_controls',
            'api_view_controls',
            'api_sync_offline',
        ]);
    }
}