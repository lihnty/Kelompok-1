<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OperatorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Admin');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => [
                'required',
                'email',
                'min:3',
                'max:255',
                Rule::unique('users')->ignore($this->operator?->user),
            ],
            'password' => $this->routeIs('admin.operators.store') ? [
                'required',
                'min:8',
                'max:255',
            ] : [
                'nullable',
                'min:8',
                'max:255',
            ],
            'faculty_id' => ['required', 'exists:faculties,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'avatar' => ['nullable', 'mimes:png,jpg,jpeg,webp', 'max:2048'],
            'employee_number' => ['required', 'string', 'max:10'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Nama',
            'email' => 'Email',
            'password' => 'Password',
            'faculty_id' => 'Fakultas',
            'department_id' => 'Program Studi',
            'avatar' => 'Avatar',
            'employee_number' => 'Nomor Induk Karyawan',
        ];
    }
}
