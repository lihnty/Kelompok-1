<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudyPlan;
use App\Enums\StudyPlanStatus;
use App\Models\Fee;
use App\Enums\FeeStatus; 
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardStudentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return inertia('Students/Dashboard', [
            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'Menampilkan semua statistik pada platform ini.',
            ],

            'count' => [
                'study_plans_approved' => StudyPlan::query()
                    ->where('status', StudyPlanStatus::APPROVED->value)
                    ->count(),
                'study_plans_reject' => StudyPlan::query() 
                    ->where('status', StudyPlanStatus::REJECT->value) 
                    ->count(),
                'total_payments' => Fee::query()
                    ->where('student_id', auth()->user()->student_id)
                    ->where('status', FeeStatus::SUCCESS->value) 
                    ->sum('amount'), 
            ]
        ]);
    }
}