<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

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

Route::get('/login', [AuthController::class, 'create'])->name('login');
Route::post('login', [AuthController::class, 'store']);
Route::get('/register', [RegisterController::class, 'create'])->name('register');
Route::post('register', [RegisterController::class, 'store']);

Route::middleware(['auth'])->group(function () {
    Route::get('/', [PageController::class, 'home'])->middleware(['auth'])->name('home');
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');
    Route::post('/issue', [TicketController::class, 'store']);
    Route::post('/project', [ProjectController::class, 'store']);
});

