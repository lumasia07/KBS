<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->after('id')->constrained('categories')->nullOnDelete();
            $table->string('decree_reference', 10)->nullable()->after('slug');
            $table->string('origin_type', 20)->nullable()->after('description');
            $table->string('production_type', 20)->nullable()->after('origin_type');
            $table->json('applicable_standards')->nullable()->after('production_type');
            $table->integer('sort_order')->default(0)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn([
                'parent_id',
                'decree_reference',
                'origin_type',
                'production_type',
                'applicable_standards',
                'sort_order',
            ]);
        });
    }
};
