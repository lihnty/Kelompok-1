<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
        'credits',
        'semester',
    ];

    public function faculty(): BelongsTo
    {
        return $this->belongsTo( related: Faculty::class);
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
}
