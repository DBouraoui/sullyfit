<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('information-board', [\App\Http\Controllers\UserInformation::class, 'create'])->name('information-board');
    Route::post('information-board-store', [\App\Http\Controllers\UserInformation::class, 'store'])->name('information-board-store');

    Route::get('goals', [\App\Http\Controllers\Goals::class, 'create'])->name('goals');
    Route::post('goals-store', [\App\Http\Controllers\Goals::class, 'store'])->name('goals-store');
    Route::delete('goals-delete/{id}', [\App\Http\Controllers\Goals::class, 'delete'])->name('goals-delete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
