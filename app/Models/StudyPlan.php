<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Enums\StudyPlanStatus;

class StudyPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'academic_year_id',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => StudyPlanStatus::class,
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo( relate: Student::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo( relate: AcademicYear::class);
    }

    public function schedulse(): BelongsToMany
    {
        return $this->belongsToMany( relate: Schedule::class, table: 'study_plan_schedule')->withTimestamps();
    }
}
