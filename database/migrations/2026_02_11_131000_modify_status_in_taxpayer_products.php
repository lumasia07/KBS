<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('taxpayer_products', function (Blueprint $table) {
            // Change enum to string to allow 'pending', 'rejected', etc.
            // This also removes the rigid CHECK constraint in SQLite.
            $table->string('status')->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('taxpayer_products', function (Blueprint $table) {
            // Revert to enum behavior (approximated by string with generic default)
            // Ideally we'd restore the enum, but 'pending' rows would violate it.
            // So we just leave it or revert to a compatible state.
        });
    }
};
