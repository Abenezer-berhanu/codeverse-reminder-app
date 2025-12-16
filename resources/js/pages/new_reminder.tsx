import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

function New_reminder() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        due_at: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as 'title' | 'description' | 'due_at', value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/create_reminder');
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reminder Dashboard" />

            <div className="flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-lg border bg-black p-8 shadow-2xl">
                    <h2 className="mb-6 text-2xl font-bold text-white">
                        Create Reminder
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter reminder title"
                            />
                            {errors.title && (
                                <p className="text-xs text-red-500">
                                    {errors.title}
                                </p>
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
                                onChange={handleChange as any}
                                rows={4}
                                className="w-full resize-none rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter reminder description (optional)"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">
                                    {errors.description}
                                </p>
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
                                value={data.due_at}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.due_at && (
                                <p className="text-xs text-red-500">
                                    {errors.due_at}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
                        >
                            {processing ? 'creating...' : 'Create Reminder'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

export default New_reminder;
