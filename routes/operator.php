<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Operator\DashboardOperatorController;
use App\Http\Controllers\Operator\StudentOperatorController;
use App\Http\Controllers\Operator\ClassroomOperatorController;
use App\Http\Controllers\Operator\CourseOperatorController;

Route::prefix('operators')->middleware(['auth', 'role:Operator'])->group(function(){
   Route::get('dashboard', DashboardOperatorController::class)->name('operators.dashboard');

   Route::controller(StudentOperatorController::class)->group(function () {
       Route::get('students', 'index')->name('operators.students.index');
       Route::get('students/create', 'create')->name('operators.students.create');
       Route::post('students/create', 'store')->name('operators.students.store');
       Route::get('students/edit/{student:student_number}', 'edit')->name('operators.students.edit');
       Route::put('students/edit/{student:student_number}', 'update')->name('operators.students.update');
       Route::delete('students/destroy/{student:student_number}', 'destroy')->name('operators.students.destroy');
   });

   Route::controller(ClassroomOperatorController::class)->group(function () {
      Route::get('classrooms', 'index')->name('operators.classrooms.index');
      Route::get('classrooms/create', 'create')->name('operators.classrooms.create');
      Route::post('classrooms/create', 'store')->name('operators.classrooms.store');
      Route::get('classrooms/edit/{classroom:slug}', 'edit')->name('operators.classrooms.edit');
      Route::put('classrooms/edit/{classroom:slug}', 'update')->name('operators.classrooms.update');
      Route::delete('classrooms/destroy/{classroom:slug}', 'destroy')->name('operators.classrooms.destroy');
  });

  Route::controller(CourseOperatorController::class)->group(function () {
      Route::get('courses', 'index')->name('operators.courses.index');
      Route::get('courses/create', 'create')->name('operators.courses.create');
      Route::post('courses/create', 'store')->name('operators.courses.store');
      Route::get('courses/edit/{course:code}', 'edit')->name('operators.courses.edit');
      Route::put('courses/edit/{course:code}', 'update')->name('operators.courses.update');
      Route::delete('courses/destroy/{course:code}', 'destroy')->name('operators.courses.destroy');
  });
});