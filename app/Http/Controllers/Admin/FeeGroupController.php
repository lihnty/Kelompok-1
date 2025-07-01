<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FeeGroup;
use Inertia\Response;
use App\Http\Resources\Admin\FeeGroupResource;
use App\Http\Requests\Admin\FeeGroupRequest;
use Illuminate\Http\RedirectResponse;
use Throwable;
use App\Enums\MessageType;

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
            'feeGroups' => FeeGroupResource::collection($feeGroups)->additional([
                'meta' => [
                    'has_pages' => $feeGroups->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10,
            ],
        ]);
    }

    public function create(): Response
    {
        return inertia('Admin/FeeGroups/Create', [
            'page_settings' => [
                'title' => 'Tambah Golongan',
                'subtitle' => 'Buat golongan baru di sini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('admin.fee-groups.store'),
            ]
        ]);
    }

    public function store(FeeGroupRequest $request): RedirectResponse
    {
        try {
            FeeGroup::create([
                'group' => $request->group,
                'amount' => $request->amount,
            ]);

            flashMessage(MessageType::CREATED->message('Golongan UKT'));
            return to_route('admin.fee-groups.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.fee-groups.index');
        }
    }
    public function edit(FeeGroup $feeGroup): Response
    {
        return inertia('Admin/FeeGroups/Edit', [
            'page_settings' => [
                'title' => 'Edit Golongan',
                'subtitle' => 'Edit golongan  di sini. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('admin.fee-groups.update', $feeGroup),
            ],
            'feeGroup' => $feeGroup,
        ]);
    }

    public function update(FeeGroup $feeGroup, FeeGroupRequest $request): RedirectResponse
    {
        try {
            $feeGroup->update([
                'group' => $request->group,
                'amount' => $request->amount,
            ]);

            flashMessage(MessageType::UPDATED->message('Golongan UKT'));
            return to_route('admin.fee-groups.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.fee-groups.index');
        }
    }

    public function destroy(FeeGroup $feeGroup): RedirectResponse
    {
        try {
            $feeGroup->delete();
            flashMessage(MessageType::DELETED->message('Golongan UKT'));
            return to_route('admin.fee-groups.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.fee-groups.index');
        }
    }

}
