<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rule; 

class RoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('Admin');
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
           'min:3',
           'max:255',

           Rule::unique( table: 'roles')->ignore( id: $this->role),

           ],

        ];

        
    }

    public function attributes(): array
    
    {

        return [
            'name' => 'Nama',
        ];

    }

}