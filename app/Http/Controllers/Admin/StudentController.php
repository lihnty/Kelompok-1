<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use App\Models\Student;
use App\Http\Resources\Admin\StudentResource;
use App\Http\Requests\Admin\StudentRequest;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\FeeGroup;
use App\Models\Classroom;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use App\Enums\MessageType;
use App\Traits\HasFile;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    use HasFile;
    public function index(): Response
    {
        $students = Student::query()
        ->select(['students.id', 'students.user_id', 'students.faculty_id', 'students.department_id', 'students.fee_group_id', 'students.classroom_id', 'students.student_number', 'students.semester', 'students.batch', 'students.fee_group_id', 'students.created_at'])
        ->filter(request()->only(['search']))
        ->sorting(request()->only(['field', 'direction']))
        ->with(['user', 'faculty', 'department', 'feeGroup', 'classroom'])
        ->whereHas('user', function ($query) {
            $query->whereHas('roles', fn($query) => $query->where('name', 'student'));
        })
        ->paginate(request()->load ?? 10);
        return inertia('Admin/Students/Index', [
            'page_settings' => [
                'title' => 'Mahasiswa',
                'subtitle' => 'Menampilkan semua data yang tersedia pada platform ini.',
            ],
            'students' => StudentResource::collection($students)->additional([
                'meta' => [
                    'has_pages' => $students->hasPages(),
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
        return inertia('Admin/Students/Create', [
            'page_settings' => [
                'title' => 'Tambah Mahasiswa',
                'subtitle' => 'Buat mahasiswa baru disini, Klik simpan setelah selesai',
                'method' => 'POST',
                'action'=> route('admin.students.store'),
            ],
            'faculties' => Faculty::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'feeGroups' => FeeGroup::query()->select(['id', 'group', 'amount'])->orderBy('group')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => 'Golongan'. $item->group . '-'. number_format($item->amount, 0, ',', '.'),
            ]),
            'classrooms' => Classroom::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }

    public function store(StudentRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'avatar' => $this->upload_file($request, 'avatar', 'users'),
            ]);

            $user->student()->create([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'classroom_id' => $request->classroom_id,
                'fee_group_id' => $request->fee_group_id,
                'student_number' => $request->student_number,
                'semester' => $request->semester,
                'batch' => $request->batch
            ]);

            $user->assignRole('Student');

            DB::commit();

            flashMessage(MessageType::CREATED->message('Mahasiswa'));
            return to_route('admin.students.index');

        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.students.index');
        }
    }
    public function edit(Student $student): Response
    {
        return inertia('Admin/Students/Edit', [
            'page_settings' => [
                'title' => 'Edit Mahasiswa',
                'subtitle' => 'Edit mahasiswa disini, Klik simpan setelah selesai',
                'method' => 'PUT',
                'action'=> route('admin.students.update', $student),
            ],
            'student' => $student->load('user'),
            'faculties' => Faculty::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'feeGroups' => FeeGroup::query()->select(['id', 'group', 'amount'])->orderBy('group')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => 'Golongan'. $item->group . '-'. number_format($item->amount, 0, ',', '.'),
            ]),
            'classrooms' => Classroom::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) => [
                'value' => $item->id,
                'label' => $item->name,
            ]),
        ]);
    }

    public function update(Student $student, StudentRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $student->update([
                'faculty_id' => $request->faculty_id,
                'department_id' => $request->department_id,
                'fee_group_id' => $request->fee_group_id,
                'classroom_id' => $request->classroom_id,
                'student_number' => $request->student_number,
                'semester' => $request->semester,
                'batch' => $request->batch,
            ]);

            $student->user()->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password ? Hash::make($request->password) : $student->user->password,
                'avatar' => $this->upload_file($request, $student->user, 'avatar', 'users'),
            ]);

            DB::commit();

            flashMessage(MessageType::UPDATED->message('Mahasiswa'));
            return to_route('admin.students.index');

        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.students.index');
        }
    }

    public function destroy(Student $student): RedirectResponse
    {
        try {
            $this->delete_file($student->user, 'avatar');
            $student->delete();


            flashMessage(MessageType::DELETED->message('Mahasiswa'));
            return to_route('admin.students.index');
        } catch (\Throwable $e) {
             flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.students.index');
        }
    }
}
