<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReminderController extends Controller
{
    /**
     * Read and return all user belonging reminders.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $id = $user->id;
        // getting all user reminders
        $my_reminders = Reminder::where("user_id", $id)->get();
        return Inertia::render('dashboard', ["user_id" => $id, "reminders" => $my_reminders]);
    }

    /**
     * Create and store new reminder.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => ["required", "string", "max:50"],
            "description" => ["required", "string", "max:500"],
            "due_at" => ["required", "date"], // this is fine
        ]);

        $reminder = new Reminder();
        $reminder->title = $validated['title'];
        $reminder->description = $validated['description'];
        $reminder->user_id = $request->user()->id;
        $reminder->due_at = Carbon::parse($validated['due_at']);

        $reminder->save();

        return redirect()->route("dashboard")
            ->with("registration_success", true);
    }

    public function show_active(Request $request)
    {
        $activeReminders = Reminder::where("user_id", $request->user()->id)->where("is_notified", false)->get();
        return $activeReminders;
    }

    public function update_reminder_is_notified($id)
    {
        $reminder = Reminder::find($id);
        $reminder->is_notified = true;
        $reminder->save();
        return redirect()->route("/dashboard");
    }


    /**
     * Get and update single reminder.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            "title" => ["required", "string", "max:50"],
            "description" => ["required", "string", "max:500"],
            "due_at" => ["required", "date"],
        ]);

        $reminder = Reminder::where("id", $id)->first();
        $reminder->title = $request->title;
        $reminder->description = $request->description;
        $reminder->due_at = $request->due_at;
        $reminder->save();


        return redirect()->route("dashboard")->with("updated", true);
    }

    /**
     * Delete single reminder.
     */
    public function destroy(string $id)
    {
        $reminder = Reminder::where("id", $id)->first();
        if ($reminder) {
            $reminder->delete();
            return redirect()->route("dashboard");
        }
    }
}
