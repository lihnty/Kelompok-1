<?php

namespace App\Http\Requests\Operator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TeacherOperatorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Operator');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->teacher?->user),
            ],
            'password' => Rule::when($this->routeIs('operators.teachers.store'), [
                'required',
                'min:8',
                'max:255',
            ]),
            Rule::when($this->routeIs('operators.teachers.update'), [
                'nullable',
                'min:8',
                'max:255',
            ]),
            'teacher_number' => [
                'required',
                'string',
                'max:10',
            ],
            'academic_title' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],
            'avatar' => [
                'nullable',
                'mimes:jpg,jpeg,png,webp',
                'max:2048', // 2MB
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Nama',
            'email' => 'Email',
            'password' => 'Password',
            'teacher_number' => 'Nomor Induk Dosen',
            'academic_title' => 'Jabatan Akademik',
        ];
    }
}
