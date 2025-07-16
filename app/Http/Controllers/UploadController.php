<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Upload;
use App\Models\User;

class UploadController extends Controller
{
    public function record(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'uploader_email' => 'required|email',
        ]);

        $user = User::where('email', $request->uploader_email)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        Upload::create([
            'filename' => $request->filename,
            'uploader_id' => $user->id,
            'upload_time' => now(),
        ]);

        return response()->json(['success' => true]);
    }
}