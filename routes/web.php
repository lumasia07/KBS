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

// Agent Login Route
Route::get('/agent/login', function () {
    return Inertia::render('auth/login', ['portalType' => 'agent']);
})->name('agent.login');

// Admin Portal Login Route
Route::get('/portal/login', function () {
    return Inertia::render('auth/login', ['portalType' => 'admin']);
})->name('portal.login');

Route::middleware(['auth', 'verified'])->group(function () {
    // Admin Dashboard
    Route::get('admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    // Taxpayer Dashboard
    Route::get('taxpayer/dashboard', function () {
        return Inertia::render('taxpayer/dashboard');
    })->name('taxpayer.dashboard');

    // Taxpayer Order Page
    Route::get('taxpayer/order', function () {
        return Inertia::render('taxpayer/order');
    })->name('taxpayer.order');

    // Agent Dashboard
    Route::get('agent/dashboard', function () {
        return Inertia::render('agent/dashboard');
    })->name('agent.dashboard');

    // Legacy redirect for old dashboard route
    Route::get('dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';

