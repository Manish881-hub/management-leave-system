<?php

namespace Database\Seeders;

use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $employee = User::create([
            'name' => 'Employee One',
            'email' => 'employee@example.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
        ]);

        $manager = User::create([
            'name' => 'Manager One',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
        ]);

        LeaveBalance::create([
            'user_id' => $employee->id,
            'total_leaves' => 24,
            'used_leaves' => 5,
        ]);

        LeaveRequest::create([
            'user_id' => $employee->id,
            'type' => 'casual',
            'start_date' => '2026-04-29',
            'end_date' => '2026-04-30',
            'reason' => 'Family event.',
            'status' => 'pending',
            'days' => 2,
        ]);

        LeaveRequest::create([
            'user_id' => $employee->id,
            'type' => 'vacation',
            'start_date' => '2026-03-11',
            'end_date' => '2026-03-13',
            'reason' => 'Already approved trip.',
            'status' => 'approved',
            'manager_comment' => 'Approved before the spring break.',
            'days' => 3,
        ]);
    }
}
