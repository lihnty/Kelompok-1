<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class StudyResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'academic_year_id',
        'semester',
        'gpa',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo( relate: Student::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo( relate: AcademicYear::class);
    }

    public function grades(): HasMany
    {
        return $this->HasMany( relate: StudyResultGrade::class);
    }
}
