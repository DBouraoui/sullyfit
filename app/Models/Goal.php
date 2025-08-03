<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = [
        'user_id',
        'actual_weight',
        'target_weight',
        'start_date',
        'end_date',
        'isSuccess'
    ];
}
