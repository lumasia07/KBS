<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone_number', 20)->nullable();
            $table->string('employee_id', 50)->unique()->nullable();

            // User type for different access levels
            $table->enum('user_type', [
                'admin',            // System administrators
                'taxpayer',         // Registered taxpayers
                'control_agent',    // Field control agents
                'supervisor',       // Supervisors/managers
                'auditor',          // Internal auditors
                'finance',          // Finance department
                'support',          // Customer support
                'api_user'          // API integration users
            ])->default('control_agent');

            // Department/Unit assignment
            $table->string('department', 100)->nullable();
            $table->string('position', 100)->nullable();

            // Location information for field agents - ADD FOREIGN KEY LATER
            $table->foreignId('municipality_id')->nullable(); // We'll add constraint later
            $table->decimal('assigned_latitude', 10, 8)->nullable();
            $table->decimal('assigned_longitude', 11, 8)->nullable();
            $table->string('assigned_zone', 100)->nullable();

            // Device information for mobile app
            $table->string('device_id', 100)->nullable();
            $table->string('device_token', 255)->nullable();
            $table->string('app_version', 20)->nullable();

            // Status and security
            $table->boolean('is_active')->default(true);
            $table->boolean('must_change_password')->default(false);
            $table->timestamp('last_password_change')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->integer('failed_login_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();

            // API access
            $table->string('api_token', 80)->unique()->nullable();
            $table->timestamp('api_token_expires_at')->nullable();

            // Taxpayer association (for taxpayer users) - ADD FOREIGN KEY LATER
            $table->uuid('taxpayer_id')->nullable(); // We'll add constraint later

            // Profile
            $table->string('profile_image_path')->nullable();
            $table->text('signature_path')->nullable();

            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_type');
            $table->index('employee_id');
            $table->index(['municipality_id', 'is_active']);
            $table->index('taxpayer_id');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
