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

            // Address information with foreign keys
            $table->string('physical_address');
            $table->foreignId('district_id')->constrained('districts');
            $table->foreignId('commune_id')->constrained('communes');
            $table->foreignId('quartier_id')->nullable()->constrained('quartiers');
            $table->string('avenue', 100)->nullable();
            $table->string('number', 20)->nullable();
            $table->string('plot_number', 50)->nullable();

            // Contact information
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
            $table->enum('registration_status', [
                'pending',
                'verified',
                'rejected',
                'suspended',
                'active'
            ])->default('pending');
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
            $table->index('district_id');
            $table->index('commune_id');
            $table->index('quartier_id');
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->boolean('requires_health_certificate')->default(false);
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('unit_type', [
                'unit',
                'pack',
                'carton',
                'liter',
                'kilogram',
                'other'
            ]);
            $table->decimal('stamp_price_per_unit', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // Table for storing product certificates
        Schema::create('product_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('certificate_type_id')->constrained()->onDelete('cascade');
            $table->string('certificate_number')->nullable();
            $table->date('issue_date');
            $table->date('expiry_date')->nullable();
            $table->string('issuing_authority');
            $table->string('issuing_country')->nullable();
            $table->text('remarks')->nullable();
            $table->string('file_path')->nullable();
            $table->boolean('is_valid')->default(true);
            $table->timestamps();
            $table->softDeletes();

            // Shorter index name to avoid MySQL 64-character limit
            $table->unique([
                'product_id',
                'certificate_type_id',
                'certificate_number'
            ], 'prod_cert_type_num_unique');
        });

        Schema::create('taxpayer_products', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('taxpayer_id')->constrained('taxpayers')->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->date('registration_date');
            // Changed from enum to string to be more flexible
            $table->string('status')->default('pending');
            $table->string('certificate_path')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('notes')->nullable();
            $table->string('health_certificate_number')->nullable();
            $table->date('health_certificate_expiry')->nullable();
            $table->timestamps();

            $table->unique(['taxpayer_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taxpayer_products');
        Schema::dropIfExists('product_certificates');
        Schema::dropIfExists('products');
        Schema::dropIfExists('taxpayers');
    }
};