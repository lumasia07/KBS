<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('taxpayers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tax_identification_number', 50)->unique();
            $table->string('company_name', 255);
            $table->foreignId('legal_form_id')->constrained('legal_forms');
            $table->string('trade_register_number', 100)->nullable();
            $table->date('trade_register_issue_date')->nullable();
            $table->foreignId('sector_id')->constrained('business_sectors');
            $table->foreignId('company_size_id')->constrained('company_sizes');

            // Contact information
            $table->string('physical_address');
            $table->string('email')->unique();
            $table->string('phone_number', 20);
            $table->string('alternate_phone', 20)->nullable();

            // Bank details
            $table->string('bank_name', 100)->nullable();
            $table->string('bank_account_number', 50)->nullable();
            $table->string('bank_account_holder', 150)->nullable();

            // Legal representatives
            $table->string('legal_representative_name', 150);
            $table->string('legal_representative_email', 150);
            $table->string('legal_representative_phone', 20);
            $table->string('legal_representative_id_number', 50);

            // Operational contacts
            $table->string('operational_contact_name', 150)->nullable();
            $table->string('operational_contact_email', 150)->nullable();
            $table->string('operational_contact_phone', 20)->nullable();

            // Status and verification
            $table->enum('registration_status', ['pending', 'verified', 'rejected', 'suspended', 'active'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->date('registration_date')->nullable();
            $table->date('verification_date')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users');

            // Security
            $table->string('api_key', 64)->unique()->nullable();
            $table->timestamp('api_key_expires_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('registration_status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taxpayers');
    }
};