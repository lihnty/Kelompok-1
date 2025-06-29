<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Course;
use App\Models\Classroom;
use App\Models\Schedule;

class DashboardTeacherController extends Controller
{
     public function __invoke(): Response
    {
        return inertia('Teachers/Dashboard', [
            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan semua statistik pada platform ini.',
            ],
            'count' => [
                'course' => Course::query()
                    ->where('teacher_id', auth()->user()->teacher->id)
                    ->count(),
                'classrooms' => Classroom::query()
                    ->whereHas('schedules.course', fn($query) => $query->where('teacher_id', auth()->user()->teacher->id))
                    ->count(),
                    'schedules' => Schedule::query()
                        ->whereHas('course', fn($query) => $query->where('teacher_id', auth()->user()->teacher->id))
                        ->count(),
            ],
        ]);
    }
}
