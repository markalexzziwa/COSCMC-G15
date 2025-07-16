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
        Schema::create('uploads', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->foreignId('uploader_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('upload_time')->nullable();
            $table->string('full_name')->nullable();
            $table->decimal('account_balance', 15, 2)->nullable();
            $table->integer('age')->nullable();
            $table->string('financial_stability')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uploads');
    }
};
