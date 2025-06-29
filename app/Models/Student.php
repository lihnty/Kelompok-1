<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


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
}
