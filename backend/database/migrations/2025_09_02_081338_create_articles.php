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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_id')->constrained('sources')->cascadeOnDelete();
            $table->string('external_id'); // id from upstream API
            $table->string('title');
            $table->string('slug')->index();
            $table->string('url')->unique();
            $table->text('summary')->nullable();
            $table->text('content')->nullable();
            $table->string('image_url')->nullable();
            $table->string('author')->nullable();
            $table->timestampTz('published_at')->index();
            $table->jsonb('raw')->nullable(); // full upstream payload
            $table->timestamps();

            $table->unique(['source_id', 'external_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
