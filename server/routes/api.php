<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeaveController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/leaves', [LeaveController::class, 'index']);
    Route::post('/leave', [LeaveController::class, 'store']);
    Route::put('/leaves/{leaveRequest}', [LeaveController::class, 'update']);
});
