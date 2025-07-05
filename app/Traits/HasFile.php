<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

trait HasFile
{
    public function upload_file(Request $request, string $column, string $folder): string
    {
        return $request->hasFile($column) 
            ? $request->file($column)->store($folder) 
            : ''; // Mengembalikan string kosong sebagai default
    }


    public function delete_file(Model $model, string $column): void
    {
        if ($model->$column && Storage::exists($model->$column)) {
            Storage::delete($model->$column);
        }
    }
}
