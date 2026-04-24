<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\LeaveBalance;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->input('email'))->first();

        if (! $user || ! Hash::check($request->input('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        $user->load('leaveBalance');

        return response()->json([
            'token' => $user->createToken('hyscaler-leave-system')->plainTextToken,
            'user' => $this->serializeUser($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user?->load('leaveBalance');

        return response()->json([
            'user' => $this->serializeUser($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    private function serializeUser(?User $user): ?array
    {
        if (! $user) {
            return null;
        }

        $balance = $user->leaveBalance;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'leave_balance' => $balance ? $this->serializeBalance($balance) : null,
        ];
    }

    private function serializeBalance(?LeaveBalance $balance): ?array
    {
        if (! $balance) {
            return null;
        }

        return [
            'id' => $balance->id,
            'user_id' => $balance->user_id,
            'total_leaves' => $balance->total_leaves,
            'used_leaves' => $balance->used_leaves,
            'remaining_leaves' => $balance->remaining_leaves,
        ];
    }
}
