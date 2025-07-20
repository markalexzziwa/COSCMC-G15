<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;

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
        case 'Vendor':
            return Inertia::render('unofficial-vendor-dashboard');
        default:
            return Inertia::render('welcome');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/market', function () {
    return Inertia::render('market');
})->middleware(['auth', 'verified'])->name('market');

Route::get('/report', function (Request $request) {
    $user = Auth::user();
    $role = '';
    if ($user && $user->role) {
        $roleName = $user->role->name;
        // Convert role names to match the case statements in report.tsx
        switch ($roleName) {
            case 'Vendor':
                $role = 'unofficial-vendor';
                break;
            case 'Inventory Manager':
                $role = 'inventory-manager';
                break;
            case 'Factory Store':
                $role = 'factory-store';
                break;
            default:
                $role = strtolower(str_replace(' ', '-', $roleName));
        }
    }
    return Inertia::render('report', [
        'dashboard' => $role,
    ]);
})->middleware(['auth', 'verified'])->name('report');
Route::get('/analytics', function (Request $request) {
    $user = Auth::user();
    $role = '';
    if ($user && $user->role) {
        $roleName = $user->role->name;
        // Convert role names to match the case statements in analytics.tsx
        switch ($roleName) {
            case 'Vendor':
                $role = 'unofficial-vendor';
                break;
            case 'Inventory Manager':
                $role = 'inventory-manager';
                break;
            case 'Factory Store':
                $role = 'factory-store';
                break;
            default:
                $role = strtolower(str_replace(' ', '-', $roleName));
        }
    }
    return Inertia::render('analytics', [
        'dashboard' => $role,
    ]);
})->middleware(['auth', 'verified'])->name('analytics');
Route::get('/chat', function (Request $request) {
    $user = Auth::user();
    $role = '';
    if ($user && $user->role) {
        $roleName = $user->role->name;
        // Convert role names to match the case statements in chat.tsx
        switch ($roleName) {
            case 'Vendor':
                $role = 'unofficial-vendor';
                break;
            case 'Inventory Manager':
                $role = 'inventory-manager';
                break;
            case 'Factory Store':
                $role = 'factory-store';
                break;
            default:
                $role = strtolower(str_replace(' ', '-', $roleName));
        }
    }
    return Inertia::render('chat', [
        'dashboard' => $role,
    ]);
})->middleware(['auth', 'verified'])->name('chat');

Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/user/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('user.dashboard');
});

Route::middleware(['auth', 'verified', 'role:vendor'])->group(function () {
    Route::get('/vendor/dashboard', function () {
        return Inertia::render('unofficial-vendor-dashboard');
    })->name('vendor.dashboard');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
});

Route::post('/admin/vendors/{id}/approve', [Controller::class, 'approveVendor'])->middleware(['auth', 'verified', 'role:admin']);
Route::post('/admin/vendors/{id}/reject', [Controller::class, 'rejectVendor'])->middleware(['auth', 'verified', 'role:admin']);

Route::post('/api/upload-record', [UploadController::class, 'record']);
Route::post('/orders', [OrderController::class, 'store']);

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
    Route::get('/orders/status', [OrderController::class, 'status']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
