import { router, useForm } from '@inertiajs/react';
import {
    ArrowBigLeft,
    Calendar,
    Check,
    Clock,
    Pen,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

function ReminderCard({
    dateStr,
    timeStr,
    reminder,
}: {
    dateStr: string;
    timeStr: string;
    reminder: {
        id: number;
        title: string;
        description?: string | undefined;
        due_at: Date;
        is_notified: boolean;
    };
}) {
    const [isEditing, setIsEditing] = useState(false);
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete you reminder')) {
            router.visit('delete_dashboard/' + reminder.id, {
                method: 'delete',
            });
        }
    };

    const { data, setData, patch, processing, errors } = useForm({
        title: reminder.title,
        description: reminder.description,
        due_at: reminder.due_at,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/update_reminder/' + reminder.id);
        setIsEditing(false);
    };

    return isEditing ? (
        <form onSubmit={handleUpdate} className="relative space-y-6 border p-2">
            <button onClick={() => setIsEditing(false)}>
                <ArrowBigLeft className="text-yellow-500" />
            </button>
            <b className="block">Updating</b>
            <div>
                <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-300"
                >
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter reminder title"
                />
                {errors.title && (
                    <p className="text-xs text-red-500">{errors.title}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-300"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter reminder description (optional)"
                />
                {errors.description && (
                    <p className="text-xs text-red-500">{errors.description}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="due_at"
                    className="mb-2 block text-sm font-medium text-gray-300"
                >
                    Due Date & Time
                </label>
                <input
                    type="datetime-local"
                    id="due_at"
                    name="due_at"
                    value={String(data.due_at)}
                    //@ts-expect-error because all incoming type from react input is string and we are trying to save it as date
                    onChange={(e) => setData('due_at', e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.due_at && (
                    <p className="text-xs text-red-500">{errors.due_at}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
            >
                {processing ? 'creating...' : 'Create Reminder'}
            </button>
        </form>
    ) : (
        <div
            key={reminder.id}
            className="hover:bg-gray-750 rounded-lg border border-gray-700 bg-gray-800 p-5 transition duration-200"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-white">
                        {reminder.title}
                    </h3>

                    {reminder.description && (
                        <p className="mb-3 text-sm text-gray-400">
                            {reminder.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="h-4 w-4" />
                            <span>{dateStr}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <Clock className="h-4 w-4" />
                            <span>{timeStr}</span>
                        </div>

                        {reminder.is_notified ? (
                            <div className="flex items-center gap-2 text-gray-300">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>Notified</span>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>

                <button
                    onClick={() => handleDelete()}
                    className="rounded p-2 text-red-400 transition duration-200 hover:bg-gray-700 hover:text-red-500"
                    aria-label="Delete reminder"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
                <Button
                    disabled={reminder.is_notified}
                    onClick={() => setIsEditing(true)}
                    className="m-0 rounded border text-yellow-400 transition duration-200 hover:bg-gray-700 hover:text-red-500"
                    aria-label="update reminder"
                >
                    <Pen className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

export default ReminderCard;
