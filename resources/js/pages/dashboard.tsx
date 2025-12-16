import ReminderCard from '@/components/reminder-card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Reminder {
    title: string;
    description?: string;
    due_at: Date;
    id: number;
    is_notified: boolean;
}

async function showReminderNotification(reminder: Reminder) {
    new Notification(reminder.title, {
        body: reminder.description || 'Your reminder is due!',
    });
    await fetch('check_due_reminders/' + reminder.id);
    router.reload();
}

const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return { dateStr, timeStr };
};

export default function Dashboard({ reminders }: { reminders: Reminder[] }) {
    useEffect(() => {
        const interval = setInterval(async () => {
            const response = await fetch('/check_due_reminders');
            const reminders = await response.json();

            reminders.forEach((reminder: Reminder) => {
                const dueTime = new Date(reminder.due_at).getTime(); // convert to number
                const now = Date.now();

                if (dueTime <= now) showReminderNotification(reminder);
            });
        }, 5000); // every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reminder Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {reminders.length > 0 ? (
                        reminders.map((reminder: Reminder) => {
                            const { dateStr, timeStr } = formatDateTime(
                                String(reminder.due_at),
                            );
                            return (
                                <div key={reminder.id}>
                                    <ReminderCard
                                        reminder={reminder}
                                        dateStr={dateStr}
                                        timeStr={timeStr}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div className="relative flex aspect-video flex-col gap-4 overflow-hidden rounded-xl border border-sidebar-border/70 p-4 text-center dark:border-sidebar-border">
                            <p>No Reminder has been found please create one</p>
                            <Link href={'dashboard/new_reminder'}>
                                <Button>Create New Reminder</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
