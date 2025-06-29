<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\StudyPlanStatus;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('study_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId( column: 'student_id')->constrained()->cascadeOnDelete();
            $table->foreignId( column: 'academic_year_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default( value: StudyPlanStatus::PENDING->value);
            $table->string('notes')->nullable();
            $table->unsignedInteger( column: 'semester')->default(value: 1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_plans');
    }
};
