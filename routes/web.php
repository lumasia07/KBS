<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Taxpayer Registration Routes
Route::get('/taxpayer/register', function () {
    return Inertia::render('TaxpayerRegistration');
})->name('taxpayer.register');

Route::post('/taxpayer/register', function () {
    // TODO: Implement taxpayer registration logic
    return redirect()->route('home')->with('success', 'Registration submitted for review');
})->name('taxpayer.register.post');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
