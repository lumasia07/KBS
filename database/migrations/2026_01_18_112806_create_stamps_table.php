<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stamps', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('serial_number', 100)->unique();
            $table->string('qr_code', 255)->unique();
            $table->foreignUuid('order_id')->constrained('stamp_orders');
            $table->foreignUuid('taxpayer_id')->constrained('taxpayers');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('stamp_type_id')->constrained('stamp_types');

            // Status tracking
            $table->enum('status', [
                'produced',
                'in_stock',
                'delivered',
                'affixed',
                'activated',
                'used',
                'lost',
                'stolen',
                'damaged',
                'expired',
                'void'
            ])->default('produced');

            // Production information
            $table->timestamp('production_date')->nullable();
            $table->string('production_batch', 50)->nullable();
            $table->foreignId('produced_by')->nullable()->constrained('users');

            // Activation/Usage information
            $table->timestamp('activation_date')->nullable();
            $table->string('activation_location')->nullable();
            $table->decimal('activation_latitude', 10, 8)->nullable();
            $table->decimal('activation_longitude', 11, 8)->nullable();
            $table->foreignId('activated_by')->nullable()->constrained('users');

            // Expiry information
            $table->timestamp('expiry_date')->nullable();

            // Loss/Damage declaration
            $table->enum('loss_type', ['lost', 'stolen', 'damaged'])->nullable();
            $table->text('loss_description')->nullable();
            $table->timestamp('loss_declaration_date')->nullable();
            $table->foreignUuid('declared_by_taxpayer_id')->nullable()->constrained('taxpayers');

            // Verification
            $table->integer('verification_count')->default(0);
            $table->timestamp('last_verification_at')->nullable();

            // Security
            $table->string('encryption_key', 255)->nullable();
            $table->string('digital_signature', 512)->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('serial_number');
            $table->index(['taxpayer_id', 'status']);
            $table->index(['product_id', 'status']);
            $table->index('expiry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stamps');
    }
};