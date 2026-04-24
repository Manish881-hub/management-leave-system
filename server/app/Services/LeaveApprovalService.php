<?php

namespace App\Services;

use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LeaveApprovalService
{
    public function review(User $manager, LeaveRequest $leaveRequest, string $status, ?string $comment): LeaveRequest
    {
        if (! $manager->isManager()) {
            throw new AuthorizationException('Only managers can review leave requests.');
        }

        return DB::transaction(function () use ($leaveRequest, $status, $comment) {
            $leaveRequest->refresh();

            if ($leaveRequest->status !== 'pending') {
                throw ValidationException::withMessages([
                    'status' => 'This leave request has already been reviewed.',
                ]);
            }

            if ($status === 'approved') {
                $days = $leaveRequest->days ?: $this->countDays($leaveRequest->start_date->toDateString(), $leaveRequest->end_date->toDateString());
                $balance = LeaveBalance::query()
                    ->where('user_id', $leaveRequest->user_id)
                    ->lockForUpdate()
                    ->first();

                if (! $balance) {
                    $balance = LeaveBalance::create([
                        'user_id' => $leaveRequest->user_id,
                        'total_leaves' => 24,
                        'used_leaves' => 0,
                    ]);
                }

                if ($balance->remaining_leaves < $days) {
                    throw ValidationException::withMessages([
                        'status' => 'Not enough leave balance to approve this request.',
                    ]);
                }

                $balance->used_leaves = $balance->used_leaves + $days;
                $balance->save();
            }

            $leaveRequest->status = $status;
            $leaveRequest->manager_comment = $comment;
            $leaveRequest->save();

            return $leaveRequest->fresh()->load('user');
        });
    }

    private function countDays(string $startDate, string $endDate): int
    {
        $start = CarbonImmutable::parse($startDate)->startOfDay();
        $end = CarbonImmutable::parse($endDate)->startOfDay();

        return $start->diffInDays($end) + 1;
    }
}
