<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaxpayerController;
use App\Http\Controllers\TaxpayerProductController;
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
    Route::get('admin/dashboard', [App\Http\Controllers\AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // Admin Orders
    Route::prefix('admin/orders')->name('admin.orders.')->group(function () {
        Route::get('/', [App\Http\Controllers\AdminOrderController::class, 'index'])->name('index');
        Route::post('/{order}/approve', [App\Http\Controllers\AdminOrderController::class, 'approve'])->name('approve');
        Route::post('/{order}/reject', [App\Http\Controllers\AdminOrderController::class, 'reject'])->name('reject');
    });

    // Taxpayer Dashboard
    Route::get('taxpayer/dashboard', function () {
        return Inertia::render('taxpayer/dashboard');
    })->name('taxpayer.dashboard');

    // Taxpayer Order Page
    // Taxpayer Order Page
    Route::get('taxpayer/order', [App\Http\Controllers\TaxpayerOrderController::class, 'index'])->name('taxpayer.order');

    // Taxpayer Order API Routes
    Route::prefix('taxpayer/orders')->name('taxpayer.orders.')->group(function () {
        Route::get('/products', [App\Http\Controllers\TaxpayerOrderController::class, 'products'])->name('products');
        Route::post('/', [App\Http\Controllers\TaxpayerOrderController::class, 'store'])->name('store');
        Route::get('/history', [App\Http\Controllers\TaxpayerOrderController::class, 'history'])->name('history');
    });

    // Taxpayer Coming Soon Features
    Route::get('taxpayer/inventory', function () {
        return Inertia::render('taxpayer/coming-soon');
    })->name('taxpayer.inventory');

    Route::get('taxpayer/payments', function () {
        return Inertia::render('taxpayer/coming-soon');
    })->name('taxpayer.payments');

    Route::get('taxpayer/compliance', function () {
        return Inertia::render('taxpayer/coming-soon');
    })->name('taxpayer.compliance');

    // Taxpayer Product Catalogue (RESTful routes)
    Route::prefix('taxpayer/products')->name('taxpayer.products.')->group(function () {
        Route::get('/', [TaxpayerProductController::class, 'index'])->name('index');
        Route::get('/create', [TaxpayerProductController::class, 'create'])->name('create');
        Route::post('/', [TaxpayerProductController::class, 'store'])->name('store');
        Route::patch('/{productId}', [TaxpayerProductController::class, 'update'])->name('update');
        Route::delete('/{productId}', [TaxpayerProductController::class, 'destroy'])->name('destroy');
    });

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

