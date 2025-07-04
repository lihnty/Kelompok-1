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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId( column: 'user_id')->constrained()->cascadeOnDelete();
            $table->foreignId( column: 'faculty_id')->constrained()->cascadeOnDelete();
            $table->foreignId( column: 'department_id')->constrained()->cascadeOnDelete();
            $table->foreignId( column: 'classroom_id')->nullable()->constrained()->nullOnDelete();
            $table->string('student_number')->unique();
            $table->unsignedInteger( column: 'semester')->default( value: 1);
            $table->year( column: 'batch');
            $table->foreignId( column: 'fee_group_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
