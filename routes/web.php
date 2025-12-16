<?php

use App\Http\Controllers\ReminderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [ReminderController::class, "index"])->name('dashboard');
    Route::delete('delete_dashboard/{id}', [ReminderController::class, "destroy"])->name('delete_dashboard');
    Route::get('dashboard/new_reminder', function () {
        return Inertia::render('new_reminder');
    })->name('new_reminder_get');
    Route::get('check_due_reminders', [ReminderController::class, 'show_active'])->name('check_due_reminders');
    Route::get('check_due_reminders/{id}', [ReminderController::class, 'update_reminder_is_notified'])->name('update_reminder_to_notified');
    Route::post('create_reminder', [ReminderController::class, 'store'])->name('create_reminder');
    Route::patch("update_reminder/{id}", [ReminderController::class, "update"])->name("update_reminder");
});

require __DIR__ . '/settings.php';
