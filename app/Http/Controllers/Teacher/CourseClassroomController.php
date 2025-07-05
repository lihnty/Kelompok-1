<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\Schedule;
use App\Http\Resources\Teacher\CourseStudentClassroomResource;


class CourseClassroomController extends Controller
{
    public function index(Course $course, Classroom $classroom)
    {
        $schedule = Schedule::query()
            ->where('course_id', $course->id)
            ->where('classroom_id', $classroom->id)
            ->first();

        $students = Student::query()
            ->where('faculty_id', $classroom->faculty_id)
            ->where('classroom_id', $classroom->id)
            ->where('department_id', $classroom->department_id)
            ->filter(request()->only(['search']))
            ->whereHas('user', function($query) {
                $query->whereHas('roles', fn($query) => $query->where('name', 'Student'));
            })
            ->whereHas('studyPlans', function($query) use ($schedule) {
                $query->where('academic_year_id', activeAcademicYear()->id)
                ->whereHas('schedules', fn($query) => $query->where('schedule_id', $schedule->id));
            })
            ->with([
                'user',
                'attendances' => fn($query) => $query->where('course_id', $course->id)->where('classroom_id', $classroom->id),
                'grades' => fn($query) => $query->where('course_id', $course->id)->where('classroom_id', $classroom->id),
            ])
            ->withCount([
                'attendances' => fn($query) => $query->where('course_id', $course->id)->where('classroom_id', $classroom->id),
            ])
            ->withSum(
                ['grades as tasks_count' => fn($query) => $query
                    ->where('course_id', $course->id)
                    ->where('classroom_id', $classroom->id)
                    ->where('category', 'tugas')
                    ->whereBetween('section', ['1', '10'])],
                'grade',
            )
            ->withSum(
                ['grades as uts_count' => fn($query) => $query
                    ->where('course_id', $course->id)
                    ->where('classroom_id', $classroom->id)
                    ->where('category', 'uts')
                    ->whereNull('section')],
                'grade',
            )
            ->withSum(
                ['grades as uas_count' => fn($query) => $query
                    ->where('course_id', $course->id)
                    ->where('classroom_id', $classroom->id)
                    ->where('category', 'uas')
                    ->whereNull('section')],
                'grade',
            )
            ->get();

        return Inertia('Teachers/Classrooms/Index', [
            'page_settings' => [
                'title' => "Kelas {$classroom->name} - Mata Kuliah {$course->name}",
                'subtitle' => 'Daftar Mahasiswa',
                'method' => 'PUT',
                'action' => route('teachers.classrooms.sync', [$course, $classroom]),
            ],
            'course' => $course,
            'classroom' => $classroom,
            'students' => CourseStudentClassroomResource::collection($students),
            'state'=> [
                'search' => request()->search ?? '',
            ]
        ]);
    }
}
