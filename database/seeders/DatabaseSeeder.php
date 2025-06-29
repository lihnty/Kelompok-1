<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
        FacultySeeder::class,
        FeeGroupSeeder::class,
    ]);     


        User::factory()->create([
            'name' => 'Admin',
            'email' => 'kelompok1@gmail.com',
        ])->assignRole(Role::create([
            'name' => 'Admin',

        ]));

        $operator = User::factory()->create([
            'name' => 'Zoro',
            'email' => 'kelompok11@gmail.com',
        ])->assignRole(Role::create([
            'name' => 'Operator',
        ]));

        $operator->operator()->create([
            'faculty_id' => 1,
            'department_id' => 1,
            'employee_number' => str()->padLeft(mt_rand(0, 999999), 6, '0'), 
        ]);

        $teacher = User::factory()->create([
            'name' => 'guru',
            'email' => 'guru@gmail.com',
        ])->assignRole(Role::create([
            'name' => 'Teacher',
        ]));

        $teacher->teacher()->create([
            'faculty_id' => 1,
            'department_id' => 1,
            'teacher_number' => str()->padLeft(mt_rand(0, 999999), 6, '0'),
            'academic_title'=> 'Asistem Ahli',
        ]);

        $student = User::factory()->create([
            'name' => 'pelajar',
            'email' => 'santri@gmail.com',
        ])->assignRole(Role::create([
            'name' => 'Student',
        ]));

        $student->student()->create([
            'faculty_id' => 1,
            'department_id' => 1,
            'fee_group_id' => rand(1, 6),
            'student_number' => str()->padLeft(mt_rand(0, 999999), 6, '0'),
            'semester'=> 1,
            'batch'=> 2025,
        ]);
    }
}
