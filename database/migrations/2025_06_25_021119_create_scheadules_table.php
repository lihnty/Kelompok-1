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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId(column: 'faculty_id')->constrained()->cascadeOnDelete();
            $table->foreignId(column: 'department_id')->constrained()->cascadeOnDelete();
            $table->foreignId(column: 'course_id')->constrained()->cascadeOnDelete();
            $table->foreignId(column: 'classroom_id')->constrained()->cascadeOnDelete();
            $table->foreignId(column: 'academic_year_id')->constrained()->cascadeOnDelete();
            $table->time( column: 'start_time');
            $table->time( column: 'end_time');
            $table->string('day_of_week');
            $table->unsignedInteger( column: 'quote')->default(value: 0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
