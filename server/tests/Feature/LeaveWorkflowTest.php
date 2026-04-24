<?php

namespace Tests\Feature;

use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LeaveWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_employee_can_submit_leave_request(): void
    {
        $employee = User::create([
            'name' => 'Employee One',
            'email' => 'employee@example.com',
            'password' => bcrypt('password'),
            'role' => 'employee',
        ]);

        Sanctum::actingAs($employee);

        $response = $this->postJson('/api/leave', [
            'type' => 'casual',
            'start_date' => '2026-04-29',
            'end_date' => '2026-05-01',
            'reason' => 'Family event',
        ]);

        $response->assertCreated()
            ->assertJsonPath('status', 'pending')
            ->assertJsonPath('days', 3);

        $this->assertDatabaseHas('leave_requests', [
            'user_id' => $employee->id,
            'status' => 'pending',
            'days' => 3,
        ]);
    }

    public function test_manager_approval_updates_leave_balance(): void
    {
        $employee = User::create([
            'name' => 'Employee One',
            'email' => 'employee@example.com',
            'password' => bcrypt('password'),
            'role' => 'employee',
        ]);

        $manager = User::create([
            'name' => 'Manager One',
            'email' => 'manager@example.com',
            'password' => bcrypt('password'),
            'role' => 'manager',
        ]);

        LeaveBalance::create([
            'user_id' => $employee->id,
            'total_leaves' => 24,
            'used_leaves' => 0,
        ]);

        $leave = LeaveRequest::create([
            'user_id' => $employee->id,
            'type' => 'vacation',
            'start_date' => '2026-04-29',
            'end_date' => '2026-05-01',
            'reason' => 'Trip',
            'status' => 'pending',
            'days' => 3,
        ]);

        Sanctum::actingAs($manager);

        $response = $this->putJson("/api/leaves/{$leave->id}", [
            'status' => 'approved',
            'manager_comment' => 'Approved. Enjoy your break.',
        ]);

        $response->assertOk()
            ->assertJsonPath('status', 'approved')
            ->assertJsonPath('manager_comment', 'Approved. Enjoy your break.');

        $this->assertDatabaseHas('leave_balances', [
            'user_id' => $employee->id,
            'used_leaves' => 3,
        ]);
    }
}
