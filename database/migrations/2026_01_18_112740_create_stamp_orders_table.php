<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stamp_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('order_number', 50)->unique();
            $table->foreignUuid('taxpayer_id')->constrained('taxpayers');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('stamp_type_id')->constrained('stamp_types');
            $table->integer('quantity');
            $table->enum('packaging_type', ['unit', 'pack', 'carton', 'pallet']);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_amount', 15, 2);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('penalty_amount', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2);

            // Order status
            $table->enum('status', [
                'draft',
                'submitted',
                'pending_verification',
                'approved',
                'payment_pending',
                'payment_confirmed',
                'in_production',
                'ready_for_delivery',
                'delivered',
                'cancelled',
                'rejected'
            ])->default('draft');

            // Payment information
            $table->string('payment_reference', 100)->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->enum('payment_method', ['mobile_money', 'bank_transfer', 'credit_card', 'cash'])->nullable();
            $table->string('payment_provider', 50)->nullable();

            // Delivery information
            $table->enum('delivery_method', ['pickup', 'delivery']);
            $table->string('delivery_address')->nullable();
            $table->timestamp('estimated_delivery_date')->nullable();
            $table->timestamp('actual_delivery_date')->nullable();
            $table->string('delivery_confirmation_code', 10)->nullable();

            // Supporting documents
            $table->string('import_declaration_path')->nullable();
            $table->string('marketing_authorization_path')->nullable();
            $table->string('certificate_of_conformity_path')->nullable();

            // Audit trail
            $table->foreignId('submitted_by')->nullable()->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->text('rejection_reason')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['taxpayer_id', 'status']);
            $table->index('order_number');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stamp_orders');
    }
};