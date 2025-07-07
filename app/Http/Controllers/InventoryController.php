<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory; // or your actual model

class InventoryController extends Controller
{
    public function index()
    {
        // Adjust fields as needed
        return response()->json(Inventory::select('name', 'quantity')->get());
    }
}