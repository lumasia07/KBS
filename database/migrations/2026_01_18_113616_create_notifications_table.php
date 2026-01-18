<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type', 100); // 'order_status', 'payment', 'control', 'complaint', 'system'
            $table->string('title', 200);
            $table->text('message');
            $table->json('data')->nullable(); // Additional data in JSON format

            // Recipient information
            $table->foreignUuid('taxpayer_id')->nullable()->constrained('taxpayers');
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('email')->nullable();
            $table->string('phone_number', 20)->nullable();

            // Delivery status
            $table->enum('delivery_method', ['in_app', 'email', 'sms', 'all']);
            $table->boolean('email_sent')->default(false);
            $table->boolean('sms_sent')->default(false);
            $table->boolean('in_app_delivered')->default(false);
            $table->timestamp('email_sent_at')->nullable();
            $table->timestamp('sms_sent_at')->nullable();
            $table->timestamp('read_at')->nullable();

            // Priority and expiration
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->timestamp('expires_at')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['taxpayer_id', 'created_at']);
            $table->index(['user_id', 'read_at']);
            $table->index(['type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};