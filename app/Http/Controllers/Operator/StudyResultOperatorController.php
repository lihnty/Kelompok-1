<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Student;
use App\Models\StudyResult;

class StudyResultOperatorController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Student $student): Response
    {
        $studyResults = StudyResult::query()
        ->select(['id', 'student_id', 'academic_year_id', 'gpa', 'semester', 'created_at'])
        ->where('student_id', $student->id)
        ->with(['student', 'grades', 'academicYear'])
        ->paginate(request()->load ?? 10);

        return inertia('Operator/Students/StudyResults/Index', [
            'page_settings' => [
                'title' => 'Kartu Hasil Studi',
                'subtitle' => "Menampilkan semua data hasil studi mahasiswa",
            ],
            'studyResults' => StudyResultOperatorResource::collection($studyResults)->additional([
                'meta' => [
                    'has_pages' => $studyResults->hasPages(),
                ]
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'load' => 10,
            ],
            'student' => $student,

        ]);
    }
}
