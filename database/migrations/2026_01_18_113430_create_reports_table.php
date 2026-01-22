<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('report_code', 50)->unique();
            $table->string('title', 200);
            $table->enum('report_type', [
                'daily',
                'weekly',
                'monthly',
                'quarterly',
                'annual',
                'ad_hoc'
            ]);

            // Filters and parameters
            $table->json('parameters')->nullable(); // Store filters as JSON
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('sector_id')->nullable()->constrained('business_sectors');

            // Generation details
            $table->foreignId('generated_by')->constrained('users');
            $table->enum('status', ['generating', 'completed', 'failed', 'cancelled'])->default('generating');

            // Output files
            $table->string('pdf_path')->nullable();
            $table->string('excel_path')->nullable();
            $table->json('chart_data')->nullable(); // Store chart configurations

            // Metrics (pre-calculated for performance)
            $table->integer('total_orders')->default(0);
            $table->decimal('total_revenue', 20, 2)->default(0);
            $table->integer('total_taxpayers')->default(0);
            $table->integer('total_controls')->default(0);
            $table->integer('total_complaints')->default(0);
            $table->decimal('compliance_rate', 5, 2)->default(0);

            $table->timestamps();

            // Indexes
            $table->index('report_code');
            $table->index(['report_type', 'start_date', 'end_date']);
            $table->index('generated_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};