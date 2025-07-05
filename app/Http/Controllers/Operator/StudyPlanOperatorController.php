<?php

namespace App\Http\Controllers\Operator;

use App\Models\StudyResult;
use App\Http\Requests\Operator\StudyPlanApproveOperatorRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Throwable;
use App\Enums\MessageType;
use App\Models\StudyPlan;
use App\Http\Controllers\Controller;
use App\Models\Student;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\Operator\StudyPlanOperatorResource;
use App\Enums\StudyPlanStatus;



class StudyPlanOperatorController extends Controller
{
     public function index(Student $student): Response
    {
        $studyPlans = StudyPlan::query()
            ->select(['id', 'student_id', 'academic_year_id', 'status', 'notes', 'semester', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->where('student_id', $student->id)
            ->with(['student', 'academicYear', 'schedules'])
            ->paginate(request()->load ?? 10);

        return Inertia::render('Operators/Students/StudyPlans/Index', [
            'page_settings' => [
                'title' => 'Kartu Rencana Studi',
                'subtitle' => 'Menampilkan semua data kartu rencana studi',
            ],
            'studyPlans' => StudyPlanOperatorResource::collection($studyPlans)->additional([
                'meta' => [
                    'has_pages' => $studyPlans->hasPages(),
                ],
            ]),
            'student' => $student,
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ],
            'statuses' => StudyPlanStatus::options(),
        ]);
    }

        public function approve(Student $student, StudyPlan $studyPlan, StudyPlanApproveOperatorRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $studyPlan->update([
                'status' => $request->status,
                'notes' => $request->notes,
            ]);

            if($studyPlan->status->value === StudyPlanStatus::APPROVED->value) {
                $studyResult = StudyResult::create([
                    'student_id' => $studyPlan->student_id,
                    'academic_year_id' => $studyPlan->academic_year_id,
                    'semester' => $studyPlan->semester,
                ]);
                foreach($studyPlan->schedules->pluck('course_id') as $course) {
                    $studyResult->grades()->create([
                        'course_id' => $course,
                        'letter' => 'E',
                        'grade' => 0,
                    ]);
                }
            }

            DB::commit();

            match($studyPlan->status->value) {
                StudyPlanStatus::REJECT->value => flashMessage('Kartu rencana studi mahasiswa berhasil di tolak', 'error'),
                StudyPlanStatus::APPROVED->value => flashMessage('Kartu rencana studi mahasiswa berhasil diterima'),
                default => null,
            };
           return to_route('operators.study-plans.index', $student);
        } catch (Throwable $e) {
            DB::rollback();
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('operators.study-plans.index', $student);
        }
    }
}
