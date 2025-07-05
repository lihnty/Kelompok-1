<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Enums\StudyPlanStatus;
use Illuminate\Database\Eloquent\Builder;

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

    public function scopeApproved(Builder $query)
    {
        return $query->where('status', StudyPlanStatus::APPROVED->value);
    }

    public function scopePending(Builder $query)
    {
        return $query->where('status', StudyPlanStatus::PENDING->value);
    }

    public function scopeReject(Builder $query)
    {
        return $query->where('status', StudyPlanStatus::REJECT->value);
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->whenAny([
                'academic_year_id',
                'semester',
            ], 'REGEXP', $search);
        });
    }

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $query->when($sorts['field'] ?? null && $sorts['direction'] ?? null, function ($query) use ($sorts) {
            $query->orderBy($sorts['field'], $sorts['direction']);
        });
    }
}
