<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'name' => 'HyScaler Leave Management API',
    'status' => 'running',
]));
