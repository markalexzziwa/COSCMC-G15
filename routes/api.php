<?php
use App\Http\Controllers\InventoryController;

Route::get('/inventory', [InventoryController::class, 'index']);