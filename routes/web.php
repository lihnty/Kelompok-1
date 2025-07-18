<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\FacultyController;
use App\Http\Controllers\Admin\OperatorController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    if (auth()->check())
    return to_route('dashboard');
    else
    return to_route('login');
});

Route::get('dashboard', function () {
     if (auth()->user()->hasRole('Admin')) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        } else if (auth()->user()->hasRole('Student')) {
             return redirect()->intended(route('students.dashboard', absolute: false));
        } else if (auth()->user()->hasRole('Teacher')) {
             return redirect()->intended(route('teachers.dashboard', absolute: false));
        } else if (auth()->user()->hasRole('Operator')) {
             return redirect()->intended(route('operators.dashboard', absolute: false));
        } else {
            return abort(404);
        }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::controller(PaymentController::class)->group(function () {
    Route::get('payments', 'create')->name('payments.create');
    Route::get('payments/callback', 'callback')->name('payments.callback');
    Route::get('payments/success', 'success')->name('payments.success');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/operator.php';
require __DIR__.'/teacher.php';
require __DIR__.'/student.php';