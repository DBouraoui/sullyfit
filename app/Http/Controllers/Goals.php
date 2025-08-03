<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class Goals extends Controller
{
    public function create() {
        $user = Auth::user()->load('goals');

        return Inertia::render('goals',[
            'goals'=>$user->goals
        ]);
    }

    public function store(Request $request) {

        Goal::Create(
            [
                'user_id' => Auth::id(),
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'actual_weight'=> $request->actual_weight,
                'target_weight'=> $request->target_weight,
                'isSuccess'=> null
            ]
        );

        return redirect()->intended(route('goals', absolute: false));
    }

    public function delete($id) {
        Goal::destroy($id);
    }
}
