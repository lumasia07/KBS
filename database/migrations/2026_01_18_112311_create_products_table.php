<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->enum('category', ['beverages', 'cosmetics', 'food', 'pharmaceuticals', 'chemicals', 'tobacco', 'other']);
            $table->enum('unit_type', ['unit', 'pack', 'carton', 'liter', 'kilogram', 'other']);
            $table->decimal('stamp_price_per_unit', 10, 2);
            $table->boolean('requires_health_certificate')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};