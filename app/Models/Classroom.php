<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Builder;



class Classroom extends Model
{
    use Sluggable;
    use HasFactory;

    protected $fillable= [
        'faculty_id',
        'department_id',
        'academic_year_id',
        'name',
        'slug',
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
            ],
        ];
    }

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

    public function students(): HasMany
    {
        return $this->hasMany( related: Student::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany( related: Schedule::class);
    }

    public function courses(): HasManyThrough
    {
        return $this->hasManyThrough(
            related: Course::class,
            through: Schedule::class,
            firstKey: 'classroom_id',
            secondKey: 'id',
            localKey: 'id',
            secondLocalKey: 'course_id'
        );
    }

    public function scopeFilter(Builder $query, array $filters): void
    {

        $query->when( this: $filters['search'] ?? null, value: function ($query, $search){
            $query->where('name','REGEXP', $search);
        });

    }

    public function scopeSorting(Builder $query, array $sorts): void
    {

        $query->when(this: $sorts['field'] ?? null && $ $sorts['direction'] ?? null, value: function ($query) use ($sorts){
            $query->orderBy($sorts['field'], $sorts['direction']);
        });

    }
}
