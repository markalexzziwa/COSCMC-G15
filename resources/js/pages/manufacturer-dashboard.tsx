import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import React from 'react'

export default function ManufacturerDashboard() {
    return (
        <AppLayout>
            <div>
                <Head title="Manufacturer Dashboard" />
                <div className="container mx-auto px-4 py-8">
                    <div className="w-full bg-white py-6 px-4 shadow rounded mb-6">
                        <h1 className="text-3xl font-bold text-purple-800 m-0">Manufacturer Dashboard</h1>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
} 