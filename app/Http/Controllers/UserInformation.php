<?php

namespace App\Http\Controllers;

use App\Models\User_information;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserInformation extends Controller
{
        public function create() {
            $user = Auth::user()->load('information');

            return Inertia::render('user_information',[
                'userInformation' => $user->information,
            ]);
        }

    public function store(Request $request) {
        User_information::updateOrCreate(
            ['user_id' => Auth::id()], // Condition de recherche
            [
                'birthdate' => $request->birthdate,
                'gender' => $request->gender,
                'level' => $request->level,
                'sport' => $request->sport,
                'frequencies' => $request->frequencies,
                'height' => $request->height,
                'weight' => $request->weight,
            ]
        );

        return redirect()->intended(route('information-board', absolute: false));
    }
}
