import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'

export default function FactoryStoreDashboard() {
    const [notification, setNotification] = useState<string | null>(null)

    useEffect(() => {
        setNotification("You're logged in as a Factory Store user!")
        const timer = setTimeout(() => {
            setNotification(null)
        }, 4000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AppLayout>
            <Head title="Factory Store Dashboard" />

            {notification && (
                <div className="fixed top-24 right-5 z-50 rounded-md bg-blue-200 p-4 text-black shadow-lg animate-in fade-in-0 slide-in-from-top-5">
                    <p>{notification}</p>
                </div>
            )}
        </AppLayout>
    )
} 