import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 4000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            {/* Notification (top-right corner) */}
            {isVisible && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-out">
                        <span className="font-medium">You're logged in as an Admin!</span>
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* ...rest of dashboard content... */}
                </div>
            </div>
        </AppLayout>
    )
} 