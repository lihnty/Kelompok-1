<?php

namespace App\Models;

use App\Enums\ScheduleDay;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'faculty_id',
        'department_id',
        'course_id',
        'classroom_id',
        'academic_year_id',
        'start_time',
        'end_time',
        'day_of_week',
        'quota',
    ];

    protected $casts = [
        'day_of_week' => ScheduleDay::class,
    ];

    public static function options(): array
    {
        return collect(ScheduleDay::cases())->map(fn($case) => [
            'value' => $case->value,
            'label' => ucfirst(strtolower($case->name)),
        ])->toArray();
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function studyPlans(): BelongsToMany
    {
        return $this->belongsToMany(StudyPlan::class, 'study_plan_schedule')->withTimestamps();
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->whereAny([
                    'start_time',
                    'end_time',
                    'day_of_week',
                ], 'REGEXP', $search)
                ->orWhereHas('faculty', fn($q) => $q->where('name', 'REGEXP', $search))
                ->orWhereHas('department', fn($q) => $q->where('name', 'REGEXP', $search))
                ->orWhereHas('course', fn($q) => $q->where('name', 'REGEXP', $search))
                ->orWhereHas('classroom', fn($q) => $q->where('name', 'REGEXP', $search));
            });
        });
    }

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $query->when(isset($sorts['field'], $sorts['direction']), function ($query) use ($sorts) {
            match ($sorts['field']) {
                'faculty_id' => $query->join('faculties', 'schedules.faculty_id', '=', 'faculties.id')
                    ->orderBy('faculties.name', $sorts['direction']),
                'department_id' => $query->join('departments', 'schedules.department_id', '=', 'departments.id')
                    ->orderBy('departments.name', $sorts['direction']),
                'course_id' => $query->join('courses', 'schedules.course_id', '=', 'courses.id')
                    ->orderBy('courses.name', $sorts['direction']),
                'classroom_id' => $query->join('classrooms', 'schedules.classroom_id', '=', 'classrooms.id')
                    ->orderBy('classrooms.name', $sorts['direction']),
                default => $query->orderBy($sorts['field'], $sorts['direction']),
            };
        });
    }
}
