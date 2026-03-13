<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('field_controls', function (Blueprint $table) {
            $table->enum('review_status', ['pending_review', 'approved', 'returned', 'escalated'])
                ->default('pending_review')
                ->after('status');
            $table->foreignId('reviewed_by')->nullable()->after('review_status')->constrained('users');
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->text('review_notes')->nullable()->after('reviewed_at');
            $table->index('review_status');
        });
    }

    public function down(): void
    {
        Schema::table('field_controls', function (Blueprint $table) {
            $table->dropIndex(['review_status']);
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['review_status', 'reviewed_at', 'review_notes']);
        });
    }
};
