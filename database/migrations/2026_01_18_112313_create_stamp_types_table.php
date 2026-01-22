<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stamp_types', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('name', 100);
            $table->enum('technology', [
                'qr_code',
                'hologram',
                'rfid',
                'digital_code',
                'security_paper'
            ]);
            $table->text('description')->nullable();
            $table->string('security_features')->nullable();
            $table->decimal('unit_cost', 10, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stamp_types');
    }
};