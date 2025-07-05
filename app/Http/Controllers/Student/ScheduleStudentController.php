<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Enums\ScheduleDay;
use App\Models\StudyPlan;

class ScheduleStudentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response|RedirectResponse
    {
        $studyPlan = StudyPlan::query()
        ->where('student_id', auth()->user()->student_id)
        ->where('academic_year', activeAcademicYear()->id)
        // ->approved()
        ->with(['schedulses'])
        ->first();

        if (!$studyPlan) {
            flashMessage('Anda belum  mengujukan krs', 'warning');
            return to_route('students.study-plans.index');
        }

        $days = ScheduleDay::case();
        $scheduleTable =[];

        foreach ($studyPlan->schedules as $schedule) {
            $startTime = substr($schedule->start_time, 0, 5);
            $endTime = substr($schedule->end_time, 0, 5);
            $day = $schedule->day_of_week->value;

            $scheduleTable[$startTime][$day] = [
                'course' => $schedule->course->name,
                'code' => $schedule->course->code,
                'end_time' => $endTime,
            ];
        }

        $scheduleTable = collect($scheduleTable)->sortKeys();

        return inertia('Student/Schedule/Index', [
            'page_settings' => [
                'title' => 'Jadwal',
                'subtitle' => 'Menampilkan semua jadwal yang tersedia.',
            ],
            'scheduleTable' => $scheduleTable,
            'days' => $days,
        ]);
    }
}
