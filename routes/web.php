<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\DeviceTopicController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return inertia('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Devices CRUD
    Route::resource('devices', DeviceController::class);

    // Device Topics & Actions
    Route::post('/devices/{device}/topics', [DeviceTopicController::class, 'store'])->name('devices.topics.store');
    Route::put('/topics/{topic}', [DeviceTopicController::class, 'update'])->name('topics.update');
    Route::delete('/topics/{topic}', [DeviceTopicController::class, 'destroy'])->name('topics.destroy');
    Route::post('/topics/{topic}/trigger', [DeviceTopicController::class, 'trigger'])->name('topics.trigger');
    Route::post('/topics/{topic}/toggle', [DeviceTopicController::class, 'toggleSwitch'])->name('topics.toggle');
});

require __DIR__.'/settings.php';
