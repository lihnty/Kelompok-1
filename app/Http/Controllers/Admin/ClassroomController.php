<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use App\Models\Classroom;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\AcademicYear;
use App\Enums\MessageType;
use App\Http\Resources\Admin\ClassroomResource;
use App\Http\Requests\Admin\ClassroomRequest;

class ClassroomController extends Controller
{
    public function index(): Response
    {
        $classrooms = Classroom::query()
            ->select(['id', 'faculty_id', 'department_id', 'academic_year_id', 'name', 'slug', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->with(['faculty', 'department', 'academicYear'])
            ->paginate(request()->load ?? 10);

        return inertia('Admin/Classrooms/Index', [
            'page_settings' => [
                'title' => 'Kelas',
                'subtitle' => 'Menampilkan semua data kelas yg tersedia pada uneversitas ini.',
            ],
            'classrooms' => ClassroomResource::collection($classrooms)->additional([
                'meta' => [
                    'has_pages' => $classrooms->hasPages(),
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
    $academic_years = AcademicYear::select('id as value', 'name as label')->orderByDesc('name')->get();
    $default_academic_year_id = $academic_years->first()?->value ?? null;

    return inertia('Admin/Classrooms/Create', [
        'page_settings' => [
            'title' => 'Tambah Kelas',
            'subtitle' => 'Buat kelas baru disini. klik simpan setelah selesai',
            'method' => 'POST',
            'action' => route('admin.classrooms.store'),
        ],
        'academic_years' => $academic_years,
        'default_academic_year_id' => $default_academic_year_id,
        'faculties' => Faculty::select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
            'value' => $item->id,
            'label' => $item->name,
        ]),
        'departments' => Department::select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
            'value' => $item->id,
            'label' => $item->name,
        ]),
    ]);
}

    public function store(ClassroomRequest $request): RedirectResponse
    {
        try {
            Classroom::create([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'academic_year_id' => $request->academic_year_id,
                'name' => $request->name,
            ]);

            flashMessage(MessageType::CREATED->message('Kelas'));
            return to_route('admin.classrooms.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return to_route('admin.classrooms.index');
        }
    }

    public function edit(Classroom $classroom): Response
    {
        return inertia('Admin/Classrooms/Edit', [
            'page_settings' => [
                'title' => 'Edit Kelas',
                'subtitle' => 'Edit kelas disini. klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.classrooms.update', $classroom),
            ],
            'classroom' => $classroom,
            'academic_years' => AcademicYear::select('id as value', 'name as label')->orderByDesc('name')->get(),
            'faculties' => Faculty::select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }

    public function update(Classroom $classroom, ClassroomRequest $request): RedirectResponse
    {
        try {
            $classroom->update([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'academic_year_id' => $request->academic_year_id,
                'name' => $request->name,
            ]);

            flashMessage(MessageType::UPDATED->message('Kelas'));
            return to_route('admin.classrooms.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return to_route('admin.classrooms.index');
        }
    }

    public function destroy(Classroom $classroom): RedirectResponse
    {
        try {
            $classroom->delete();
            flashMessage(MessageType::DELETED->message('Kelas'));
            return to_route('admin.classrooms.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return to_route('admin.classrooms.index');
        }
    }
}
