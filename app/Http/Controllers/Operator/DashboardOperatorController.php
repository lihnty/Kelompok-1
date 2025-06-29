<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Student; // Tambahkan ini
use App\Models\Teacher; // Tambahkan ini
use App\Models\Classroom; // Tambahkan ini
use App\Models\Course; // Tambahkan ini

class DashboardOperatorController extends Controller
{
    /**
     * Handle the incoming request.
     */
     public function __invoke(): Response
    {
        return inertia('Operators/Dashboard', [
            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan semua statistik pada platform ini.',
            ],
            'count' => [
            'students' => Student::query()
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->count(),
            'teachers' => Teacher::query()
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->count(),
            'classrooms' => Classroom::query()
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->count(),
            'courses' => Course::query()
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->count(),
            ]
        ]);
    }
}
