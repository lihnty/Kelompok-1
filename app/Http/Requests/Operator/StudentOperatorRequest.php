<?php

namespace App\Http\Requests\Operator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentOperatorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Operator');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore(optional($this->student)->user),
            ],
            'password' => [
                Rule::when(
                    $this->routeIs('operators.students.create'),
                    ['required', 'min:8', 'max:255']
                ),
                Rule::when(
                    $this->routeIs('operators.students.update'),
                    ['nullable', 'min:8', 'max:255']
                ),
            ],
            'avatar' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048'],
            'student_number' => [
                'required',
                'string',
                'max:13',
                Rule::unique('students', 'student_number')->ignore($this->student),
            ],
            'semester' => ['required', 'integer', 'min:1'],
            'batch' => ['required', 'integer'],
            'fee_group_id' => ['required', 'exists:fee_groups,id'],
            'classroom_id' => ['required', 'exists:classrooms,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Nama',
            'email' => 'Email',
            'password' => 'Password',
            'avatar' => 'Avatar',
            'student_number' => 'Nomor Pokok Mahasiswa',
            'semester' => 'Semester',
            'batch' => 'Angkatan',
            'fee_group_id' => 'Golongan UKT',
            'classroom_id' => 'Kelas',
        ];
    }
}
