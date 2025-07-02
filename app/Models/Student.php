<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;


class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'faculty_id',
        'department_id',
        'classroom_id',
        'fee_group_id',
        'student_number',
        'semester',
        'batch',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo( related: User::class);
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo( related: Faculty::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo( related: Department::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo( related: Classroom::class);
    }

    public function feeGroup(): BelongsTo
    {
        return $this->belongsTo( related: FeeGroup::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasmany( related: Attendance::class);
    }

    public function grade(): HasMany
    {
        return $this->hasmany( related: Grade::class);
    }

    public function studyPlans(): HasMany
    {
        return $this->hasmany( related: StudyPlans::class);
    }

    public function studyResult(): HasMany
    {
        return $this->hasmany( related: StudyResult::class);
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereAny([
                'student_number',
                'name',
                'batch',
            ], 'REGEXP', $search)
                ->orWhereHas('user', fn($query) => $query->whereAny(['name', 'email'], 'REGEXP', $search))
                ->orWhereHas('faculty', fn($query) => $query->whereAny('name', 'REGEXP', $search))
                ->orWhereHas('department', fn($query) => $query->whereAny('name', 'REGEXP', $search));
        });
    }

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $query->when($sorts['field'] ?? null && $sorts['direction'] ?? null, function ($query) use ($sorts) {
            match ($sorts['field']) {
                'faculty_id' => $query->join('faculties', 'students.faculty_id', '=', 'faculties.id')
                    ->orderBy('faculties.name', $sorts['direction']),
                'department_id' => $query->join('departments', 'students.department_id', '=', 'departments.id')
                    ->orderBy('departments.name', $sorts['direction']),
                'name' => $query->join('users', 'students.user_id', '=', 'users.id')
                    ->orderBy('users.name', $sorts['direction']),
                'email' => $query->join('users', 'students.user_id', '=', 'users.id')
                    ->orderBy('users.email', $sorts['direction']),
                'fee_group_id' => $query->join('fee_groups', 'students.fee_group_id', '=', 'fee_groups.id')
                    ->orderBy('fee_groups.group', $sorts['direction']),
                'classroom_id' => $query->join('classrooms', 'students.fee_group_id', '=', 'classrooms.id')
                    ->orderBy('classrooms.group', $sorts['direction']),
                
                default => $query->orderBy($sorts['field'], $sorts['direction'])
            };
        });
    }
}
