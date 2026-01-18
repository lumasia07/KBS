<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('complaint_number', 50)->unique();
            $table->foreignUuid('taxpayer_id')->nullable()->constrained('taxpayers');
            $table->string('complainant_name', 150);
            $table->string('complainant_email', 150)->nullable();
            $table->string('complainant_phone', 20)->nullable();

            // Complaint details
            $table->enum('type', [
                'stamp_issue',
                'payment_problem',
                'order_delay',
                'delivery_issue',
                'control_dispute',
                'system_error',
                'fraud_report',
                'other'
            ]);

            $table->string('subject', 200);
            $table->text('description');
            $table->json('attachments_paths')->nullable();

            // Status and resolution
            $table->enum('status', [
                'new',
                'in_review',
                'in_progress',
                'resolved',
                'rejected',
                'escalated'
            ])->default('new');

            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->foreignId('assigned_to')->nullable()->constrained('users');
            $table->text('resolution')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users');

            // Reference to related entities
            $table->foreignUuid('order_id')->nullable()->constrained('stamp_orders');
            $table->foreignUuid('payment_id')->nullable()->constrained('payments');
            $table->foreignUuid('stamp_id')->nullable()->constrained('stamps');

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('complaint_number');
            $table->index(['taxpayer_id', 'status']);
            $table->index(['status', 'priority']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};