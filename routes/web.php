<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dashboard', function () {
    $user = Auth::user();
    switch ($user->role->name) {
        case 'Admin':
            return Inertia::render('admin-dashboard');
        case 'Farmer':
            return Inertia::render('farmer-dashboard');
        case 'Inventory Manager':
            return Inertia::render('inventory-manager-dashboard');
        case 'Manufacturer':
            return Inertia::render('manufacturer-dashboard');
        case 'Factory Store':
            return Inertia::render('factory-store-dashboard');
        case 'Distributor':
            return Inertia::render('distributor-dashboard');
        case 'Retail':
            return Inertia::render('retail-dashboard');
        case 'Customer':
            return Inertia::render('customer-dashboard');
        default:
            return Inertia::render('welcome');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/user/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('user.dashboard');
});

Route::middleware(['auth', 'verified', 'role:editor'])->group(function () {
    Route::get('/editor/dashboard', function () {
        return Inertia::render('editor-dashboard');
    })->name('editor.dashboard');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin-dashboard');
    })->name('admin.dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/yield-tracking', function () {
        return Inertia::render('yield-tracking');
    })->name('yield.tracking');

    Route::get('/resource-management', function () {
        return Inertia::render('resource-management');
    })->name('resource.management');

    Route::get('/groves', function () {
        return Inertia::render('groves');
    })->name('groves');

    Route::get('/financials', function () {
        return Inertia::render('financials');
    })->name('financials');

    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
