<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Course;
use App\Models\Schedule;
use App\Enums\ScheduleDay;

class ScheduleTeacherController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $cources = Course::query()
            ->where('teacher_id', auth()->user()->teacher->id)
            ->pluck('id');

        $schedules = Schedule::query()
            ->whereIn('course_id', $cources)
            ->get();

            $days = ScheduleDay::cases();
            $scheduleTable = [];

            foreach($schedules as $schedule){
                $starTime = substr($schedule->star_time, 0, 5);
                $endTime = substr($schedule->end_time, 0, 5);
                $day = $schedule->day_of_week->value;

                $scheduleTable[$startTime][$day] = [ 
                    'course' => $schedule->couse->name,
                    'end_time' => $endTime,
                ];
            }

            $scheduleTable = collect($scheduleTable)->sortKeys();

            return inertia('Teachers/Schedules/Index', [
                'page_settings' => [
                    'title' => 'Jadwal',
                    'subtitle' => 'Menampilkan Semua Jadwal Mengajar Anda'
                ],
                'scheduleTable' => $scheduleTable,
                'days' => $days,
            ]);
        }
}
