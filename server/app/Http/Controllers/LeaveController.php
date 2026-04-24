<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveRequest;
use App\Http\Requests\UpdateLeaveStatusRequest;
use App\Models\LeaveRequest as LeaveRequestModel;
use App\Services\LeaveApprovalService;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    public function __construct(private readonly LeaveApprovalService $approvalService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = LeaveRequestModel::query()
            ->with('user:id,name,email,role')
            ->orderByDesc('created_at');

        if ($user?->isEmployee()) {
            $query->where('user_id', $user->id);
        }

        return response()->json([
            'data' => $query->get()->map(fn (LeaveRequestModel $leaveRequest) => $this->serializeLeave($leaveRequest)),
        ]);
    }

    public function store(StoreLeaveRequest $request): JsonResponse
    {
        $user = $request->user();

        if (! $user?->isEmployee()) {
            abort(403, 'Only employees can submit leave requests.');
        }

        $days = $this->countDays($request->input('start_date'), $request->input('end_date'));

        $leaveRequest = LeaveRequestModel::create([
            'user_id' => $user->id,
            'type' => $request->input('type'),
            'start_date' => $request->date('start_date'),
            'end_date' => $request->date('end_date'),
            'reason' => $request->input('reason'),
            'status' => 'pending',
            'days' => $days,
        ]);

        $leaveRequest->load('user');

        return response()->json($this->serializeLeave($leaveRequest), 201);
    }

    public function update(UpdateLeaveStatusRequest $request, LeaveRequestModel $leaveRequest): JsonResponse
    {
        $user = $request->user();

        if (! $user?->isManager()) {
            abort(403, 'Only managers can review leave requests.');
        }

        $updated = $this->approvalService->review(
            $user,
            $leaveRequest,
            $request->input('status'),
            $request->input('manager_comment'),
        );

        return response()->json($this->serializeLeave($updated));
    }

    private function serializeLeave(LeaveRequestModel $leaveRequest): array
    {
        return [
            'id' => $leaveRequest->id,
            'user_id' => $leaveRequest->user_id,
            'employee_name' => $leaveRequest->user?->name,
            'employee_email' => $leaveRequest->user?->email,
            'type' => $leaveRequest->type,
            'start_date' => $leaveRequest->start_date->toDateString(),
            'end_date' => $leaveRequest->end_date->toDateString(),
            'reason' => $leaveRequest->reason,
            'status' => $leaveRequest->status,
            'manager_comment' => $leaveRequest->manager_comment,
            'days' => $leaveRequest->days,
            'created_at' => $leaveRequest->created_at?->toIso8601String(),
            'updated_at' => $leaveRequest->updated_at?->toIso8601String(),
        ];
    }

    private function countDays(string $startDate, string $endDate): int
    {
        $start = CarbonImmutable::parse($startDate)->startOfDay();
        $end = CarbonImmutable::parse($endDate)->startOfDay();

        return $start->diffInDays($end) + 1;
    }
}
