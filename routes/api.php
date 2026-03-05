<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AgentController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes in this file are automatically assigned the "api"
| middleware group and are prefixed with /api.
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
| Routes that do not require authentication.
|--------------------------------------------------------------------------
*/

/**
 * Authentication - Login
 */
Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Authenticated API Routes (Sanctum)
|--------------------------------------------------------------------------
| Protected routes requiring valid API token.
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    /*
    |--------------------------------------------------------------------------
    | Agent API Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('agent')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */
        Route::get('/dashboard', [AgentController::class, 'dashboard']);

        /*
        |--------------------------------------------------------------------------
        | Inspections
        |--------------------------------------------------------------------------
        */
        Route::get('/inspections', [AgentController::class, 'inspections']);
        Route::post('/inspections', [AgentController::class, 'storeInspection']);
        Route::get('/inspections/{id}', [AgentController::class, 'showInspection']);
    });
});