<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('taxpayer_products', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('taxpayer_id')->constrained('taxpayers')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products');
            $table->date('registration_date');
            $table->enum('status', ['active', 'suspended', 'expired'])->default('active');
            $table->string('health_certificate_number')->nullable();
            $table->date('health_certificate_expiry')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['taxpayer_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taxpayer_products');
    }
};