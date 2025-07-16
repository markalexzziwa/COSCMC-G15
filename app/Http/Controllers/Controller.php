<?php

namespace App\Http\Controllers;

abstract class Controller
{
    // Approve a vendor
    public function approveVendor($id)
    {
        $user = \App\Models\User::findOrFail($id);
        $user->is_approved = true;
        $user->save();
        return response()->json(['success' => true]);
    }

    // Reject a vendor
    public function rejectVendor($id)
    {
        $user = \App\Models\User::findOrFail($id);
        $user->is_approved = false;
        $user->save();
        return response()->json(['success' => true]);
    }
}
