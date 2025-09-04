<?php

use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\SourceController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::apiResource('sources', SourceController::class)->only(['index']);
    Route::apiResource('articles', ArticleController::class)->only(['index', 'show']);
});
