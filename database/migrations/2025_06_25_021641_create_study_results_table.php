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
        Schema::create('study_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId( column: 'course_id')->constrained()->cascadeOnDelete();
            $table->foreignId( column: 'academic_year_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger( column: 'semester')->default(value: 1);
            $table->double('gpa', 5, 2)->default(value: 0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_results');
    }
};
