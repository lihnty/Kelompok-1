<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FeeGroup;
use Inertia\Response;
use App\Http\Resources\Admin\FeeGroupResource;



class FeeGroupController extends Controller
{
    public function index(): Response
    {
        $feeGroups = FeeGroup::query()
            ->select(['id', 'amount', 'group', 'created_at'])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->paginate(request()->load ?? 10);

            return inertia('Admin/FeeGroups/Index', [
                'page_settings'=> [
                    'title' =>'Golongan',
                    'subtitle' =>'Menampilkan semua data golongan ukt yang tersedia pada platform ini',
                ],

                'feeGroups' => FeeGroupResource::collection($feeGroups)->additional( [
                    'meta' => [
                        'has_pages' => $feeGroups->hasPages(),
                    ],
                ]),

                'state' => [
                    'page' => request()->page ?? 1,
                    'search' =>request()->search ?? '',
                    'load' => 10,
                ],
            ]);
    }
}
