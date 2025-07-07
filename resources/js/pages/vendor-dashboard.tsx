import React, { useEffect, useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function VendorDashboard() {
    // No file input or upload handler needed for manual upload via Java server page
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AppLayout>
            <Head title="Vendor Dashboard" />

            {/* Notification (top-right corner) */}
            {isVisible && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-out">
                        <span className="font-medium">You're logged in as a Vendor!</span>
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Home Card */}
                    <div className="max-w-md mx-auto mb-6">
                        <div
                            className="bg-yellow-50 border border-yellow-200 rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                            onClick={() => window.location.href = '/'}
                        >
                            <div className="text-2xl font-bold text-yellow-700 mb-2">Home</div>
                            <div className="text-gray-600 text-center mb-2">Go to the welcome page</div>
                        </div>
                    </div>

                    {/* Download and Upload Cards Row */}
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                        {/* Application Download Card */}
                        <div className="max-w-md w-full">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-md p-6 flex flex-col items-center h-full">
                                <div className="text-2xl font-bold text-blue-700 mb-2">Application Download</div>
                                <div className="text-gray-600 text-center mb-2">Click the button below to download the application template (apptemplate.docx)</div>
                                <form method="GET" action="http://localhost:8080/download/apptemplate">
                                    <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Download</button>
                                </form>
                            </div>
                        </div>
                        {/* PDF Upload Card */}
                        <div className="max-w-md w-full">
                            <div className="bg-green-50 border border-green-200 rounded-xl shadow-md p-6 flex flex-col items-center h-full">
                                <div className="text-2xl font-bold text-green-700 mb-2">PDF Upload</div>
                                <div className="text-gray-600 text-center mb-2">Save your application as "username".pdf before proceeding. Select and upload your application as a PDF file.</div>
                                <button
                                    className="mt-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold text-lg"
                                    onClick={() => window.open('http://localhost:8080/', '_blank')}
                                    type="button"
                                >
                                    Open Upload Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
} 