<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Classroom;
use App\Models\Student;
use App\Http\Requests\Admin\ClassroomStudentRequest;
use App\Http\Resources\Admin\ClassroomStudentResource;
use Illuminate\Http\RedirectResponse;
use App\Enums\MessageType;

class ClassroomStudentController extends Controller
{
    public function index(Classroom $classroom): Response
    {
        $classroomStudents = Student::query()
        ->select(['id', 'user_id', 'classroom_id', 'student_number', 'created_at'])
        ->where('classroom_id', $classroom->id)
        ->whereHas('user', function($query) {
            $query->whereHas('roles', fn($query) => $query->where('name', 'Student'));
        })
        ->orderBy('student_number')
        ->with(['user'])
        ->paginate(10);

        return inertia('Admin/Classrooms/Students/Index', [
            'page_settings' => [
                'title' => "Kelas {$classroom->name}",
                'subtitle' => 'Menampilkan semua data mahasiswa yang tersedia pada kelas ini.',
                'method' => 'PUT',
                'action' => route('admin.classroom-students.sync', $classroom),
            ],
            'students' => Student::query()
            ->select(['id', 'user_id', 'faculty_id', 'department_id', 'classroom_id'])
            ->whereHas('user', function($query) {
                $query->whereHas('roles', fn($query) => $query->select(['id', 'name'])->where('name', 'Student')->orderBy('name'));
            })
            ->where('faculty_id', $classroom->faculty_id)
            ->where('department_id', $classroom->department_id)
            ->where(function ($query) use ($classroom) {
            $query->whereNull('classroom_id')
                ->orWhere('classroom_id', $classroom->id);
            })
            ->get()
            ->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->user->name,
            ]),
            'classroomStudents' => ClassroomStudentResource::collection($classroomStudents),
            'classroom' => $classroom,
        ]);
    }

    public function sync(Classroom $classroom, ClassroomStudentRequest $request): RedirectResponse
    {
        try {
            Student::whereHas('user', fn($query) => $query->where('name', $request->student))->update([
                'classroom_id' => $classroom->id,
            ]);

            flashMessage("Berhasil menambahkan mahasiswa baru ke dalam kelas {$classroom->name}");
            return to_route('admin.classroom-students.index', ['classroom' => $classroom->slug]);
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.classroom-students.index', ['classroom' => $classroom->slug]);
        }
    }

    public function destroy(Classroom $classroom, Student $student): RedirectResponse
    {
        try {
            $student->update([
                'classroom_id' => null,
            ]);
            flashMessage("Berhasil menghapus mahasiswa {$student->user->name} dari kelas {$classroom->name}");
            return to_route('admin.classroom-students.index', ['classroom' => $classroom->slug]);
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.classroom-students.index', ['classroom' => $classroom->slug]);
        }
    }
}
