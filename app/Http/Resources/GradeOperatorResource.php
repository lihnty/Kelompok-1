<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeOperatorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'course_id' => $this->course_id ?? null,
            'letter' => $this->letter ?? null,
            'weight_of_value' => $this->weight_of_value ?? null,
            'grade' => $this->grade ?? null,
            'course' => $this->whenLoaded('course', [
                'id' => $this->course?->id,
                'name' => $this->course?->name,
            ]),
        ];
    }
}