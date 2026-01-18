<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Check if taxpayers table exists
        if (Schema::hasTable('taxpayers')) {
            Schema::table('users', function (Blueprint $table) {
                // Add foreign key constraint for taxpayer_id
                $table->foreign('taxpayer_id')
                    ->references('id')
                    ->on('taxpayers')
                    ->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['taxpayer_id']);
        });
    }
};