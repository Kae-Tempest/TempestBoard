<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

Route::post('login', [AuthController::class, 'store']);

Route::get('/register', function () {
    return Inertia::render('Register');
})->name('register');

Route::post('register', [RegisterController::class, 'store']);

Route::middleware(['auth'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->name('welcome');
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['auth'])->name('dashboard');

});

