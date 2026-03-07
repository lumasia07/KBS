<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, make payment_provider nullable
        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_provider')->nullable()->change();
        });

        // Add the payment_method_id column and foreign key
        Schema::table('payments', function (Blueprint $table) {
            // Add payment_method_id column after existing payment_method
            $table->unsignedBigInteger('payment_method_id')->nullable()->after('payment_method');

            // Add foreign key constraint
            $table->foreign('payment_method_id')
                ->references('id')
                ->on('payment_methods')
                ->onDelete('set null');
        });

        // Migrate existing data to use the new structure
        $this->migrateExistingData();

        // After migrating data, remove the old enum column
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First, revert payment_method changes
        Schema::table('payments', function (Blueprint $table) {
            // Re-add the enum column
            $table->enum('payment_method', [
                'orange_money',
                'airtel_money',
                'mpesa',
                'visa',
                'mastercard',
                'bank_transfer',
                'cash'
            ])->nullable()->after('payment_method_id');

            // Drop the foreign key and column
            $table->dropForeign(['payment_method_id']);
            $table->dropColumn('payment_method_id');
        });

        // Revert payment_provider to not nullable
        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_provider')->nullable(false)->change();
        });
    }

    /**
     * Migrate existing payment_method values to payment_method_id
     */
    private function migrateExistingData(): void
    {
        // Check if payment_methods table exists and has data
        if (!Schema::hasTable('payment_methods')) {
            return;
        }

        // Get the mapping of payment method codes to IDs
        $methods = DB::table('payment_methods')->pluck('id', 'code');

        if ($methods->isEmpty()) {
            return;
        }

        // Update each payment record with the corresponding payment_method_id
        foreach ($methods as $code => $id) {
            DB::table('payments')
                ->where('payment_method', $code)
                ->update(['payment_method_id' => $id]);
        }

        // Handle any records with payment_method values that don't match
        // (set them to a default method or leave as null)
        $validCodes = $methods->keys()->toArray();
        DB::table('payments')
            ->whereNotNull('payment_method')
            ->whereNotIn('payment_method', $validCodes)
            ->update(['payment_method_id' => null]);
    }
};