<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;
use App\Models\Upload;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $vendors = User::whereHas('role', function($q) {
            $q->where('name', 'Vendor');
        })->get();

        return Inertia::render('admin-dashboard', [
            'vendors' => $vendors,
        ]);
    }
} 