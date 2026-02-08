<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('certificate_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 50)->unique();
            $table->text('description')->nullable();
            $table->json('requirements')->nullable();
            $table->boolean('is_required_by_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->boolean('requires_certificate')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // Pivot table for category-certificate type relationships
        Schema::create('category_certificate_type', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('certificate_type_id')->constrained()->onDelete('cascade');
            $table->boolean('is_required')->default(true);
            $table->text('specific_requirements')->nullable();
            $table->timestamps();

            $table->unique(['category_id', 'certificate_type_id']);
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('unit_type', [
                'unit',
                'pack',
                'carton',
                'liter',
                'kilogram',
                'other'
            ]);
            $table->decimal('stamp_price_per_unit', 10, 2);
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
            $table->unique(['product_id', 'certificate_type_id', 'certificate_number'], 'prod_cert_type_num_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_certificates');
        Schema::dropIfExists('products');
        Schema::dropIfExists('category_certificate_type');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('certificate_types');
    }
};