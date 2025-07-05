<?php

namespace App\Http\Resources\Operator;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StudentOperatorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_number' => $this->student_number,
            'semester' => $this->semester,
            'batch' => $this->batch,
            'created_at' => $this->created_at,

            'user' => $this->whenLoaded('user', [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
                'avatar' => $this->user?->avatar ? Storage::url($this->user->avatar) : null,
            ]),

            'feeGroup' => $this->whenLoaded('feeGroup', [
                'value' => $this->feeGroup?->id,
                'label' => $this->feeGroup?->group,
            ]),

            'classroom' => $this->whenLoaded('classroom', [
                'value' => $this->classroom?->id,
                'label' => $this->classroom?->name,
            ]),
        ];
    }
}
