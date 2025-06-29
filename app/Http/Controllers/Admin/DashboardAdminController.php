<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Classroom;
use App\Models\Course;

class DashboardAdminController extends Controller
{
    public function __invoke(): Response
    {
        return inertia('Admin/Dashboard', [
            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan semua statistik pada platform ini.',
            ],
            'count' => [
                'faculties' => Faculty::count(),
                'departments' => Department::count(),
                'classrooms' => Classroom::count(),
                'courses' => Course::count(),
            ],
        ]);
    }
}
