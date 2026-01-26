<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaxpayerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Home/Landing page route
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

/*
|--------------------------------------------------------------------------
| Resource Routes (Better to use this) 
| You can update taxpayer registration to taxpayer.create and storage route to taxpayer.store 
| Then uncomment the routes
|--------------------------------------------------------------------------
*/
// Route::resources([
//     'taxpayer' => TaxpayerController::class,
// ]);

/*
|--------------------------------------------------------------------------
| Taxpayer grouped Routes
|--------------------------------------------------------------------------
*/
Route::prefix('taxpayer')->group(function () {
    Route::get('/register', [TaxpayerController::class, 'create'])->name('taxpayer.register');
    Route::post('/register', [TaxpayerController::class, 'store'])->name('taxpayer.register.post');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__ . '/settings.php';
