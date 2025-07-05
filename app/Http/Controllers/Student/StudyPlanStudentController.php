<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudyPlan;
use App\Http\Resources\Student\StudyPlanStudentResource;
use Inertia\Inertia;
use Illuminate\Http\Response;
use Illuminate\Http\RedirectResponse;
use App\Http\Resources\Student\ScheduleResource;
use App\Models\Schedule;
use App\Models\StudyPlanStatus;
use Illuminate\Support\Facades\DB;

class StudyPlanStudentController extends Controller
{
    public function index()
    {
        $studyPlans = StudyPlan::query()
            ->select(['id', 'status', 'created_at', 'academic_year_id', 'student_id'])
            ->where('student_id', auth()->user()->student->id)
            ->with(['academicYear'])
            ->latest('created_at')
            ->paginate(request()->load ?? 10);

            return Inertia::render('Students/StudyPlans/Index', [
            'page_settings' => [
                'title' => 'Kartu Rencana Studi',
                'subtitle' => 'Menampilkan semua data kartu rencana studi yang tersedia.',
            ],
            'studyPlans' => StudyPlanStudentResource::collection($studyPlans)->additional([
                'meta' => [
                    'has_pages' => $studyPlans->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ],
        ]);
    }

    public function create(): Response | RedirectResponse
    {
        if(!activeAcademicYear());

        $schedule = Schedule::query()
            ->where('faculty_id', auth()->user()->student->faculty_id)
            ->where('department_id', auth()->user()->student->department_id)
            ->where('academic_year_id', activeAcademicYear()->id)
            ->with(['course', 'classroom'])
            ->withCount(['studyPlans as taken_quota' => fn($query) => $query->where('academic_year_id', activeAcademicYear()->id)])
            ->orderBy('day_of_week')
            ->get();

            if($schedule->isEmpty()) {
                flashMessage('Tidak ada jadwal yang tersedia...','warning');
                return to_route('students.study-plans.index');
            }

            $studyPlan = StudyPlan::query()
                ->where('student_id', auth()->user()->student->id)
                ->where('academic_year_id', activeAcademicYear()->id)
                ->where('semester', auth()->user()->student->semester)
                ->where('status', '!=', StudyPlanStatus::REJECT)
                ->exists();

            if($studyPlan) {
                flashMessage('Anda sudah mengajukan KRS','warning');
                return to_route('students.study-plans.index');
            }

        return Inertia::render('Students/StudyPlans/Create', [
            'page_settings' => [
                'title' => 'Tambah Kartu Rencana Studi',
                'subtitle' => 'Menambahkan data kartu rencana studi baru.',
                'method' => 'POST',
                'action' => route('students.study-plans.store'),
            ],
            'schedules' => ScheduleResource::collection($schedule),
        ]);
    }

    public function store(StudyPlanStudentRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $studyPlan = StudyPlan::create([
                'student_id' => auth()->user()->student->id,
                'academic_year_id' => activeAcademicYear()->id,
            ]);

            $studyPlan->schedule()->attach($request->schedule_id);

            DB::commit();
            flashMessage('Berhasil mengajukan KRS');
            return to_route('students.study-plans.index');
        } catch (Throwable $e) {
            DB::rollBack();
            flashMessage(MessageType::ERROR->message($e->getMessage()), 'error');
            return to_route('students.study-plans.index');
        }
    }

    public function show(StudyPlan $studyPlan): Response
    {
        return Inertia('Students/StudyPlans/Show', [
            'page_settings' => [
                'title' => 'Detail Kartu Rencana Studi',
                'subtitle' => 'Anda dapat melihat kartu rencana studi yg anda ajukan sebelumnya.',
            ],
            'studyPlan' => new StudyPlanScheduleStudentResource($studyPlan->load('schedules')),
        ]);
    }
}