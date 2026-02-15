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
    }

    public function down(): void
    {
        Schema::dropIfExists('category_certificate_type');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('certificate_types');
    }
};