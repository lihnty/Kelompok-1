<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class AcademicYear extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'start_date',
        'end_date',
        'semester',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'semester' => AcademicYearSemester::class,
        ];
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereAny(['name', 'semester'],'REGEXP', $search);
        });
    }

    public function scopeSorting(Builder $query): void
    {
        $query->where('is_active', true);
    }
}