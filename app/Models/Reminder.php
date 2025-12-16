<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        "title",
        "description",
        "user_id",
        "due_at",
    ];


    protected $casts = [
        'due_at' => 'datetime:Y-m-d H:i:s',
    ];
}
