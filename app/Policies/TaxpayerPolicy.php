<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Taxpayer;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaxpayerPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_taxpayers') ||
            $user->hasRole(['Super Administrator', 'System Administrator', 'Registration Officer']);
    }

    public function view(User $user, Taxpayer $taxpayer): bool
    {
        // Taxpayer users can only view their own taxpayer record
        if ($user->isTaxpayerUser() && $user->taxpayer_id === $taxpayer->id) {
            return true;
        }

        return $user->hasPermissionTo('view_taxpayers') ||
            $user->hasRole(['Super Administrator', 'System Administrator', 'Registration Officer']);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_taxpayers') ||
            $user->hasRole(['Super Administrator', 'System Administrator', 'Registration Officer']);
    }

    public function update(User $user, Taxpayer $taxpayer): bool
    {
        // Taxpayer users can only update their own taxpayer record
        if ($user->isTaxpayerUser() && $user->taxpayer_id === $taxpayer->id) {
            return $user->hasPermissionTo('edit_taxpayers');
        }

        return $user->hasPermissionTo('edit_taxpayers') ||
            $user->hasRole(['Super Administrator', 'System Administrator', 'Registration Officer']);
    }

    public function delete(User $user, Taxpayer $taxpayer): bool
    {
        return $user->hasPermissionTo('delete_taxpayers') ||
            $user->hasRole(['Super Administrator', 'System Administrator']);
    }

    public function verify(User $user, Taxpayer $taxpayer): bool
    {
        return $user->hasPermissionTo('verify_taxpayers') ||
            $user->hasRole(['Super Administrator', 'System Administrator', 'Registration Officer']);
    }

    public function suspend(User $user, Taxpayer $taxpayer): bool
    {
        return $user->hasPermissionTo('suspend_taxpayers') ||
            $user->hasRole(['Super Administrator', 'System Administrator']);
    }

    public function export(User $user): bool
    {
        return $user->hasPermissionTo('export_taxpayers') ||
            $user->hasRole(['Super Administrator', 'System Administrator', 'Registration Officer']);
    }
}