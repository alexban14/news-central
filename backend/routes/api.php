<?php

use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AuthorController;
use App\Http\Controllers\Api\V1\SourceController;
use App\Http\Controllers\Api\V1\UserPreferenceController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::apiResource('sources', SourceController::class)->only(['index']);
    Route::apiResource('authors', AuthorController::class)->only(['index']);
    Route::get('/articles/general', [ArticleController::class, 'generalIndex']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::get('/user/preferences', [UserPreferenceController::class, 'getPreferences']);
        Route::put('/user/preferences', [UserPreferenceController::class, 'updatePreferences']);
        Route::get('/articles/personalized', [ArticleController::class, 'personalizedIndex']);
    });
});
