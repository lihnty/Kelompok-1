<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'faculty_id',
        'department_id',
        'teacher_id',
        'academic_year_id',
        'code',
        'name',
        'credit',
        'semester',
    ];

    public function faculty(): BelongsTo
    {
        return $this->belongsTo( related: Faculty::class);
    }
    
    public function teacher(): BelongsTo
    {
        return $this->belongsTo( related: Teacher::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo( related: Department::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo( related: AcademicYear::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany( related: Schedule::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany( related: Attendance::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany( related: Grade::class);
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereAny(['name', 'code'],'REGEXP', $search)
            ->orWhereHas('teacher.user', fn($query) => $query->whereAny(['name', 'email'],'REGEXP', $search))
            ->orWhereHas('faculty', fn($query) => $query->where('name', 'REGEXP', $search))
            ->orWhereHas('department', fn($query) => $query->where('name', 'REGEXP', $search));
        });
    }

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $query->when($sorts['field'] ?? null && $sorts['direction'] ?? null, function ($query) use ($sorts){
            match ($sorts['field']) {
                'faculty_id' => $query->join('faculties', 'courses.faculty_id', '=', 'faculties.id')
                    ->orderBy('faculties.name', $sorts['direction']),
                'department_id' => $query->join('departments', 'courses.department_id', '=', 'departments.id')
                    ->orderBy('departments.name', $sorts['direction']),
                'name' => $query
                    ->leftJoin('teachers', 'teachers.id', '=', 'courses.teacher_id')
                    ->leftJoin('users', 'teachers.user_id', '=', 'users.id')
                    ->orderBy('users.name', $sorts['direction']),
                default => $query->orderBy($sorts['field'], $sorts['direction']),
            };
        });
    }
}
