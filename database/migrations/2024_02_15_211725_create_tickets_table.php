<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->integer('ticket_id');
            $table->string('title');
            $table->text('description');
            $table->foreignId('creator_id')->constrained('users', 'id');
            $table->foreignId('assigned_id')->constrained('users', 'id');
            $table->foreignId('project_id')->constrained('projects', 'id');
            $table->string('status');
            $table->string('priority');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
