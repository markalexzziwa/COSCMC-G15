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
    switch ($user->role) {
        case 'admin':
            return Inertia::render('admin-dashboard');
        case 'farmer':
            return Inertia::render('farmer-dashboard');
        case 'inventory_manager':
            return Inertia::render('inventory-manager-dashboard');
        case 'manufacturer':
            return Inertia::render('manufacturer-dashboard');
        case 'factory_store':
            return Inertia::render('factory-store-dashboard');
        case 'distributor':
            return Inertia::render('distributor-dashboard');
        case 'retail':
            return Inertia::render('retail-dashboard');
        default:
            return Inertia::render('customer-dashboard');
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
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
