<?php

use App\Http\Controllers\Admin\ReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FieldControlController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductionController;
use App\Http\Controllers\Admin\ProductRequestController;

use App\Http\Controllers\Taxpayer\TaxpayerController;
use App\Models\Report;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Landing Page
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


/*
|--------------------------------------------------------------------------
| Taxpayer Registration
|--------------------------------------------------------------------------
*/
Route::prefix('taxpayer')->name('taxpayer.')->group(function () {
    Route::get('/register', [TaxpayerController::class, 'create'])->name('register');
    Route::post('/register', [TaxpayerController::class, 'store'])->name('register.store');
});


/*
|--------------------------------------------------------------------------
| Portal Login Routes
|--------------------------------------------------------------------------
*/
Route::get('/agent/login', function () {
    return Inertia::render('auth/login', ['portalType' => 'agent']);
})->name('agent.login');

Route::get('/portal/login', function () {
    return Inertia::render('auth/login', ['portalType' => 'admin']);
})->name('portal.login');


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->name('admin.')->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | Admin Orders
        |--------------------------------------------------------------------------
        */
        Route::prefix('orders')->name('orders.')->group(function () {
            Route::get('/', [OrderController::class, 'index'])->name('index');
            Route::post('/{order}/status', [OrderController::class, 'status'])->name('status');
            Route::post('/{order}/approve', [OrderController::class, 'approve'])->name('approve');
            Route::post('/{order}/reject', [OrderController::class, 'reject'])->name('reject');
        });

        Route::prefix('payments')->name('payments.')->group(function () {
            Route::get('/', [App\Http\Controllers\Taxpayer\PaymentController::class, 'index'])->name('index');
        });

        /*
        |--------------------------------------------------------------------------
        | Admin Production
        |--------------------------------------------------------------------------
        */
        Route::prefix('production')->name('production.')->group(function () {
            Route::get('/', [ProductionController::class, 'index'])->name('index');
            Route::get('/progress/{batchId}', [ProductionController::class, 'progress'])->name('progress');
            Route::get('/{order}/preview', [ProductionController::class, 'preview'])->name('preview');
            Route::get('/{order}/print', [ProductionController::class, 'printBatch'])->name('print');
            Route::post('/{order}/generate', [ProductionController::class, 'generate'])->name('generate');
            Route::post('/{order}/ready', [ProductionController::class, 'markReady'])->name('ready');
            Route::post('/{order}/cancel', [ProductionController::class, 'cancel'])->name('cancel');
            Route::get('/{order}/stamps', [ProductionController::class, 'stamps'])->name('stamps');
            Route::get('/{order}', [ProductionController::class, 'show'])->name('show');
        });

        /*
        |--------------------------------------------------------------------------
        | Admin Taxpayers
        |--------------------------------------------------------------------------
        */
        Route::prefix('taxpayers')->name('taxpayers.')->group(function () {
            Route::get('/', [TaxpayerController::class, 'index'])->name('index');
            Route::post('/{taxpayer}/approve', [TaxpayerController::class, 'approve'])->name('approve');
            Route::post('/{taxpayer}/reject', [TaxpayerController::class, 'reject'])->name('reject');
        });

        /*
        |--------------------------------------------------------------------------
        | Admin Field Controls
        |--------------------------------------------------------------------------
        */
        Route::prefix('field-controls')->name('field-controls.')->group(function () {
            Route::get('/', [FieldControlController::class, 'index'])->name('index');
            Route::get('/{control}', [FieldControlController::class, 'show'])->name('show');
            Route::post('/{control}/approve', [FieldControlController::class, 'approve'])->name('approve');
            Route::post('/{control}/reject', [FieldControlController::class, 'reject'])->name('reject');
        });

        /*
        |--------------------------------------------------------------------------
        | Admin Product Requests
        |--------------------------------------------------------------------------
        */
        Route::prefix('products/requests')->name('products.requests.')->group(function () {
            Route::get('/', [ProductRequestController::class, 'index'])->name('index');
            Route::post('/{id}/approve', [ProductRequestController::class, 'approve'])->name('approve');
            Route::patch('/{id}/reject', [ProductRequestController::class, 'reject'])->name('reject');
        });

        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/', [ReportController::class, 'index'])->name('index');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | Taxpayer Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('taxpayer')->name('taxpayer.')->group(function () {
        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */
        Route::get('/dashboard', [App\Http\Controllers\Taxpayer\DashboardController::class, 'index'])
            ->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | Orders
        |--------------------------------------------------------------------------
        */
        Route::prefix('orders')->name('orders.')->group(function () {
            Route::get('/', [App\Http\Controllers\Taxpayer\OrderController::class, 'index'])->name('index');
            Route::get('/products', [App\Http\Controllers\Taxpayer\OrderController::class, 'products'])->name('products');
            Route::get('/history', [App\Http\Controllers\Taxpayer\OrderController::class, 'history'])->name('history');
            Route::get('/{order}/checkout', [App\Http\Controllers\Taxpayer\OrderController::class, 'checkout'])->name('checkout');
            Route::post('/store', [App\Http\Controllers\Taxpayer\OrderController::class, 'store'])->name('store');
        });

        /*
        |--------------------------------------------------------------------------
        | Payments
        |--------------------------------------------------------------------------
        */
        Route::prefix('payments')->name('payments.')->group(function () {
            Route::get('/', [App\Http\Controllers\Taxpayer\PaymentController::class, 'index'])->name('index');
            Route::post('/store', [App\Http\Controllers\Taxpayer\PaymentController::class, 'store'])->name('store');
        });

        /*
        |--------------------------------------------------------------------------
        | Product Catalogue
        |--------------------------------------------------------------------------
        */
        Route::prefix('products')->name('products.')->group(function () {
            Route::get('/', [App\Http\Controllers\Taxpayer\ProductController::class, 'index'])->name('index');
            Route::get('/create', [App\Http\Controllers\Taxpayer\ProductController::class, 'create'])->name('create');
            Route::post('/store', [App\Http\Controllers\Taxpayer\ProductController::class, 'store'])->name('store');
            Route::patch('/{productId}', [App\Http\Controllers\Taxpayer\ProductController::class, 'update'])->name('update');
            Route::delete('/{productId}', [App\Http\Controllers\Taxpayer\ProductController::class, 'destroy'])->name('destroy');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | Agent Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('agent')->name('agent.')->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Agent\FieldControlController::class, 'dashboard'])
            ->name('dashboard');

        Route::prefix('inspections')->name('inspections.')->group(function () {
            Route::get('/', [App\Http\Controllers\Agent\FieldControlController::class, 'index'])->name('index');
            Route::get('/create', [App\Http\Controllers\Agent\FieldControlController::class, 'create'])->name('create');
            Route::post('/', [App\Http\Controllers\Agent\FieldControlController::class, 'store'])->name('store');
            Route::get('/{control}', [App\Http\Controllers\Agent\FieldControlController::class, 'show'])->name('show');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | Legacy Redirect
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/
require __DIR__ . '/settings.php';