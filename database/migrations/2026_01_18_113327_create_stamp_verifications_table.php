<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stamp_verifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('stamp_id')->constrained('stamps');
            $table->foreignUuid('field_control_id')->nullable()->constrained('field_controls');
            $table->foreignId('verifier_id')->constrained('users');

            // Verification details
            $table->enum('verification_method', ['qr_scan', 'rfid_scan', 'manual_entry', 'api_call']);
            $table->string('device_id', 100)->nullable();
            $table->string('device_model', 50)->nullable();

            // Location
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('location_address')->nullable();

            // Result
            $table->boolean('is_valid')->default(false);
            $table->enum('verification_result', [
                'valid',
                'invalid',
                'duplicate',
                'expired',
                'not_activated',
                'reported_lost',
                'counterfeit'
            ]);

            $table->text('details')->nullable();
            $table->timestamp('verification_date');

            // For offline verification
            $table->boolean('was_offline')->default(false);
            $table->timestamp('sync_date')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['stamp_id', 'verification_date']);
            $table->index(['verifier_id', 'verification_date']);
            $table->index('verification_result');

            // FIXED: Regular composite index instead of spatial index
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stamp_verifications');
    }
};