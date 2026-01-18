<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->string('category', 50)->default('general');
            $table->text('value')->nullable();
            $table->text('description')->nullable();
            $table->enum('type', ['string', 'integer', 'float', 'boolean', 'json', 'array'])->default('string');
            $table->boolean('is_public')->default(false);
            $table->boolean('is_encrypted')->default(false);
            $table->timestamps();

            $table->index(['category', 'key']);
        });

        // Create API keys table for external integrations
        Schema::create('api_keys', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('key', 64)->unique();
            $table->string('secret', 64);
            $table->foreignId('user_id')->constrained('users');
            $table->json('permissions')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('key');
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_keys');
        Schema::dropIfExists('settings');
    }
};