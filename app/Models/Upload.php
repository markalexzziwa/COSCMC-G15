<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Upload extends Model
{
    use HasFactory;

    protected $fillable = [
        'filename',
        'uploader_id',
        'upload_time',
        'full_name',
        'account_balance',
        'age',
        'financial_stability',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }
}
