<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Fee extends Model
{
    use HasFactory;

    protected $fillable = [
        'fee_code',
        'student_id',
        'fee_group_id',
        'academic_year_id',
        'semester',
        'status',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo( related: Student::class);
    }

    public function feeGroup(): BelongsTo
    {
        return $this->belongsTo( related: feeGroup::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo( related: academicYear::class);
    }
}
