<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Student\DashboardStudentController;
use App\Http\Controllers\Student\FeeStudentController;

Route::prefix('students')->middleware(['auth', 'role:Student'])->group(function(){
    Route::get('dashboard', DashboardStudentController::class)->name('students.dashboard');

    Route::get('fees', FeeStudentController::class)->name('students.fees.index');
});