<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use Inertia\Inertia;
use App\Http\Resources\Operator\CourseOperatorResource;
use App\Http\Requests\Operator\CourseOperatorRequest;
use App\Models\Teacher;
use App\Enums\MessageType;
use Throwable;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class CourseOperatorController extends Controller
{
    public function index()
    {
        $courses = Course::query()
        ->select('courses.id', 'courses.code', 'courses.name', 'courses.credit', 'courses.semester', 'courses.created_at', 'courses.teacher_id', 'courses.faculty_id', 'courses.department_id')
        ->filter(request()->only('search'))
        ->sorting(request()->only('field', 'direction'))
        ->where('courses.faculty_id', auth()->user()->operator->faculty_id)
        ->where('courses.department_id', auth()->user()->operator->department_id)
        ->with(['academicYear', 'teacher'])
        ->paginate(request()->load ?? 10);

        return Inertia::render('Operators/Courses/Index', [
            'page_settings' => [
                'title' => 'Mata Kuliah',
                'subtitle' => 'Menampilkan semua data mata kuliah yang tersedia.',
            ],
            'courses' => CourseOperatorResource::collection($courses)->additional([
                'meta' => [
                    'has_pages' => $courses->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ],
        ]);
    }


    public function create(): Response
    {
        return Inertia::render('Operators/Courses/Create', [
            'page_settings' => [
                'title' => 'Tambah Mata Kuliah',
                'subtitle' => 'Buat mata kuliah baru di sini. Klik simpan setelah selesai.',
                'method' => 'POST',
                'action' => route('operators.courses.store'),
            ],
            'teachers' => Teacher::query()
                ->select(['id', 'user_id'])
                ->whereHas('user', function($query){
                    $query->whereHas('roles', fn($query) => $query->where('name', 'Teacher'))->orderBy('name');
                })
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->with(['user'])
                ->get()
                ->map(fn($item) => [
                    'value' => $item->id,
                    'label' => $item->user->name,
                ])
        ]);
    }

    public function store(CourseOperatorRequest $request): RedirectResponse
    {
        try {
            Course::create([
                'faculty_id' => auth()->user()->operator->faculty_id,
                'department_id' => auth()->user()->operator->department_id,
                'academic_year_id' => activeAcademicYear()->id,
                'teacher_id' => $request->teacher_id,
                'code' => str()->random(6),
                'name' => $request->name,
                'credit' => $request->credit,
                'semester' => $request->semester,
            ]);

            flashMessage(MessageType::CREATED->message('Mata Kuliah'));
            return to_route('operators.courses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return to_route('operators.courses.index');
        }
    }
    public function edit(Course $course): Response
    {
        return Inertia::render('Operators/Courses/Edit', [
            'page_settings' => [
                'title' => 'Ubah Mata Kuliah',
                'subtitle' => 'Ubah mata kuliah disini. Klik simpan setelah selesai.',
                'method' => 'PUT',
                'action' => route('operators.courses.update', $course),
            ],
            'course' => $course,
            'teachers' => Teacher::query()
                ->select(['id', 'user_id'])
                ->whereHas('user', function($query){
                    $query->whereHas('roles', fn($query) => $query->where('name', 'Teacher'))->orderBy('name');
                })
                ->where('faculty_id', auth()->user()->operator->faculty_id)
                ->where('department_id', auth()->user()->operator->department_id)
                ->with(['user'])
                ->get()
                ->map(fn($item) => [
                    'value' => $item->id,
                    'label' => $item->user->name,
                ])
        ]);
    }

    public function update(CourseOperatorRequest $request, Course $course): RedirectResponse
    {
        try {
            $course->update([
                'teacher_id' => $request->teacher_id,
                'name' => $request->name,
                'credit' => $request->credit,
                'semester' => $request->semester,
            ]);

            flashMessage(MessageType::UPDATED->message('Mata Kuliah'));
            return to_route('operators.courses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return to_route('operators.courses.index');
        }
    }

    public function destroy(Course $course): RedirectResponse
    {
        try {
            $course->delete();

            flashMessage(MessageType::DELETED->message('Mata Kuliah'));
            return to_route('operators.courses.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return to_route('operators.courses.index');
        }
    }
}
