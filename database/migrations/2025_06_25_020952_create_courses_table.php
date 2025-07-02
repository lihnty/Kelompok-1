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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId( column: 'faculty_id')->constrained()->cascadeOnDelete();
            $table->foreignId( column: 'department_id')->constrained()->cascadeOnDelete();
            $table->foreignId( column: 'teacher_id')->constrained()->cascadeOnDelete();
            $table->foreignId( column: 'academic_year_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code')->unique();
            $table->string('name');
            $table->unsignedInteger( column: 'credit');
            $table->unsignedInteger( column: 'semester');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
