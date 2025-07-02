<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Operator\DashboardOperatorController;
use App\Http\Controllers\Operator\ClassroomOperatorController;

Route::prefix('operators')->middleware(['auth', 'role:Operator'])->group(function(){
   Route::get('dashboard', DashboardOperatorController::class)->name('operators.dashboard');

   Route::controller(ClassroomOperatorController::class)->group(function () {
      Route::get('classrooms', 'index')->name('operators.classrooms.index');
      Route::get('classrooms/create', 'create')->name('operators.classrooms.create');
      Route::post('classrooms/create', 'store')->name('operators.classrooms.store');
      Route::get('classrooms/edit/{classroom:slug}', 'edit')->name('operators.classrooms.edit');
      Route::put('classrooms/edit/{classroom:slug}', 'update')->name('operators.classrooms.update');
      Route::delete('classrooms/destroy/{classroom:slug}', 'destroy')->name('operators.classrooms.destroy');
  });
});