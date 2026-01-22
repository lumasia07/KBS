<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('field_controls', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('control_number', 50)->unique();
            $table->foreignId('control_agent_id')->constrained('users');
            $table->foreignUuid('taxpayer_id')->nullable()->constrained('taxpayers');
            $table->string('business_name', 255)->nullable();

            // Location
            $table->string('location_address');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            
            // Control details
            $table->enum('control_type', ['routine', 'targeted', 'complaint_based', 'random']);
            $table->timestamp('control_date');
            $table->integer('duration_minutes')->nullable();

            // Results
            $table->integer('total_items_checked')->default(0);
            $table->integer('compliant_items')->default(0);
            $table->integer('non_compliant_items')->default(0);
            $table->integer('counterfeit_items')->default(0);

            // Status
            $table->enum('status', ['in_progress', 'completed', 'cancelled', 'requires_followup'])->default('in_progress');
            $table->text('observations')->nullable();
            $table->text('recommendations')->nullable();

            // Evidence
            $table->json('photos_paths')->nullable();
            $table->json('documents_paths')->nullable();

            // Offence declaration
            $table->boolean('offence_declared')->default(false);
            $table->text('offence_description')->nullable();
            $table->decimal('proposed_fine', 15, 2)->nullable();
            $table->enum('offence_severity', ['minor', 'moderate', 'severe', 'critical'])->nullable();

            // Synchronization for mobile app
            $table->boolean('is_synced')->default(true);
            $table->timestamp('sync_date')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('control_number');
            $table->index(['control_agent_id', 'control_date']);

            // Regular composite index for latitude/longitude queries
            $table->index(['latitude', 'longitude']);

            // If you need to query by latitude range or longitude range separately
            $table->index('latitude');
            $table->index('longitude');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('field_controls');
    }
};