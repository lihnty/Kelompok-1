<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Operator\DashboardOperatorController;
use App\Http\Controllers\Operator\TeacherOperatorController;

Route::prefix('operators')->middleware(['auth', 'role:Operator'])->group(function () {
    // Dashboard
    Route::get('dashboard', DashboardOperatorController::class)->name('operators.dashboard');

    // Teacher Management
    Route::controller(TeacherOperatorController::class)->group(function () {
    Route::get('teachers', 'index')->name('operators.teachers.index');
    Route::get('teachers/create', 'create')->name('operators.teachers.create');
    Route::post('teachers', 'store')->name('operators.teachers.store');
    Route::get('teachers/{teacher}/edit', 'edit')->name('operators.teachers.edit');
    Route::put('teachers/{teacher}', 'update')->name('operators.teachers.update');
    Route::delete('teachers/{teacher}', 'destroy')->name('operators.teachers.destroy');
});
});
