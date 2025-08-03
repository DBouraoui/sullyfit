<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User_information extends Model
{

    protected $fillable = [
        'birthdate',
        'gender',
        'height',
        'weight',
        'level',
        'sport',
        'frequencies',
        'user_id'
    ];

}
