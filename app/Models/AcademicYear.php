<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Enums\AcademicYearSemester;
use Cviebrock\EloquentSluggable\Sluggable;

class AcademicYear extends Model
{
    use Sluggable;
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'start_date',
        'end_date',
        'semester',
        'is_active',
    ];
    
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
            ],
        ];
    }

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

    public function scopeSorting(Builder $query, array $sorts): void
    {
        $query->when($sorts['field'] ?? null && $sorts['direction'] ?? null, function ($query) use ($sorts){
            $query->orderBy($sorts['field'], $sorts['direction']);
        });
    }

}