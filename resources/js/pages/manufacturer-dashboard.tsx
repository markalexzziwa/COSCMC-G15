import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'

export default function ManufacturerDashboard() {
    return (
        <AppLayout>
            <Head title="Manufacturer Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 bg-green-100">You're logged in as a Manufacturer!</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
} 