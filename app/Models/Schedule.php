<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class Schedule extends Model
{
    use HasFactory;

    protected $fillable= [
        'faculty_id',
        'department_id',
        'course_id',
        'classroom_id',
        'academic_year_id',
        'start_time',
        'end_time',
        'day_of_week',
        'quote'
    ];

    protected function casts(): array
    {
        return [
            'day_of_week' => ScheduleDay::class,
        ];
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(related: Department::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo( related: course::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo( related: Classroom::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo( related: AcademicYear::class);
    }

    public function studyPlans(): BelongsToMany
    {
        return $this->belongsToMany(related: StudyPlan::class, table: 'study_plan_schedule')->withTimestamps();
    }
}
