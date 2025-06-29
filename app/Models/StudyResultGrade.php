<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class StudyResultGrade extends Model
{
    use HasFactory;

    protected $fillable = [
        'study_result_id',
        'course_id',
        'letter',
        'weight_of_value',
        'grade',
    ];

    public function StudyResult(): BelongsTo
    {
        return $this->belongsTo( related: StudyResult::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo( related: Course::class);
    }

}
