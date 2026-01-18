<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number', 50)->unique();
            $table->foreignUuid('order_id')->constrained('stamp_orders');
            $table->foreignUuid('taxpayer_id')->constrained('taxpayers');
            $table->decimal('amount', 15, 2);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('penalty_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2);

            // Payment details
            $table->enum('payment_method', ['orange_money', 'airtel_money', 'mpesa', 'visa', 'mastercard', 'bank_transfer', 'cash']);
            $table->string('transaction_id', 100)->unique();
            $table->string('payment_provider', 50);
            $table->json('payment_provider_response')->nullable();

            // Status
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'])->default('pending');
            $table->timestamp('payment_date');
            $table->timestamp('confirmation_date')->nullable();

            // QR Code for invoice
            $table->string('invoice_qr_code', 255)->nullable();
            $table->string('invoice_pdf_path')->nullable();

            // Refund information
            $table->boolean('is_refunded')->default(false);
            $table->decimal('refund_amount', 15, 2)->nullable();
            $table->timestamp('refund_date')->nullable();
            $table->text('refund_reason')->nullable();

            // Audit trail
            $table->foreignId('confirmed_by')->nullable()->constrained('users');
            $table->text('failure_reason')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('invoice_number');
            $table->index(['taxpayer_id', 'status']);
            $table->index('payment_date');
            $table->index('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};