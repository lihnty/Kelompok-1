<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Schedule;
use App\Http\Resources\Operator\ScheduleOperatorResource;
use App\Models\Classroom;
use App\Models\Course;
use App\Enums\MessageType;
use App\Http\Requests\Operator\ScheduleOperatorRequest;
use App\Enums\ScheduleDay;
use Illuminate\Http\RedirectResponse;
use Throwable;  






class ScheduleOperatorController extends Controller
{
   public function index(): Response

   {

$schedules = Schedule::query()
    ->select([
        'schedules.id', 'schedules.faculty_id', 'schedules.department_id',
        'schedules.course_id', 'schedules.classroom_id', 'schedules.academic_year_id',
        'schedules.start_time', 'schedules.end_time', 'schedules.day_of_week',
        'schedules.quota', 'schedules.created_at'
    ])
    ->when(request('search'), function ($query, $search) {
        $query->whereHas('course', function ($q) use ($search) {
            $q->where('name', 'like', "%$search%");
        });
    })
    ->when(request('field') && request('direction'), function ($query) {
        $query->orderBy(request('field'), request('direction'));
    })
    ->where('schedules.faculty_id', auth()->user()->operator->faculty_id)
    ->where('schedules.department_id', auth()->user()->operator->department_id)
    ->with(['course', 'classroom', 'academicYear'])
    ->paginate((int) request('load', 10));

        return inertia('Operators/Schedules/Index', [

            'page_settings' => [

                'title' => 'Jadwal',

                'subtitle' => 'Menampilkan semua data jadwal yang tersedia.',

            ],

            'schedules' => ScheduleOperatorResource::collection($schedules)->additional([
                'meta' => [
                    'has_pages' => $schedules->hasPages(),
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

        return inertia('Operators/Schedules/Create', [

            'page_settings' => [

                'title' => 'Tambah Jadwal',

                'subtitle' => 'buat jadwal baru disini. Klik disimpan setelah selesai.',

                'method' => 'POST',

                'action' => route('operators.schedules.store'),

            ],

                'classrooms' => Classroom::query()

                ->select(['id', 'name'])

                ->orderBy('name')

                ->where('faculty_id', auth()->user()->operator->faculty_id)
                
                ->where('department_id', auth()->user()->operator->department_id)

                ->get()

                ->map(fn($item) => [

                    'value' => $item->id,

                    'label' => $item->name,

                ]),

                                'courses' => Course::query()

                ->select(['id', 'name'])

                ->orderBy('name')

                ->where('faculty_id', auth()->user()->operator->faculty_id)
                
                ->where('department_id', auth()->user()->operator->department_id)

                ->get()

                ->map(fn($item) => [

                    'value' => $item->id,

                    'label' => $item->name,

                ]),

                    'days' => ScheduleDay::options(),


        ]);

     }


     public function store(ScheduleOperatorRequest $request): RedirectResponse

     {

        try {

                Schedule::create([

                    'faculty_id' => auth()->user()->operator->faculty_id,

                    'department_id' => auth()->user()->operator->department_id,

                    'course_id' => $request->course_id,

                    'classroom_id' => $request->classroom_id,

                    'academic_year_id' => activeAcademicYear()->id,

                    'start_time' => $request->start_time,

                    'end_time' => $request->end_time,

                    'day_of_week' => $request->day_of_week,

                    'quota' => $request->quota,

                ]);

                 flashMessage(MessageType::CREATED->message('Jadwal'));

                 return to_route('operators.schedules.index');


        } catch (Throwable $e) {

            flashMessage(MessageType::Error->message(error: $e->getMessage()), 'error');

            return to_route('operators.schedules.index');

        }

     }


}
