import React, { useEffect, useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function UnofficialVendorDashboard() {
    const [isVisible, setIsVisible] = useState(true)
    const [acceptedVendors, setAcceptedVendors] = useState<string[]>([]);
    const [rejectedVendors, setRejectedVendors] = useState<string[]>([]);
    const [pdfFiles, setPdfFiles] = useState<{ name: string; url: string; size: number; lastModified: number }[]>([]);
    const [acceptedVendorDates, setAcceptedVendorDates] = useState<{ [username: string]: string }>({});

    // Fetch PDF list from Java server
    useEffect(() => {
        fetch('http://localhost:8080/api/pdflist')
            .then(res => res.json())
            .then((files: { name: string; size: number; lastModified: number }[]) => {
                setPdfFiles(files.map(f => ({
                    ...f,
                    url: `/javaserver/applicationupload/${f.name}`
                })));
            });
    }, []);

    // Sync with localStorage and filter by current PDFs
    useEffect(() => {
        function syncVendors() {
            const savedAccepted = localStorage.getItem('acceptedVendors');
            const savedRejected = localStorage.getItem('rejectedVendors');
            const savedDates = localStorage.getItem('acceptedVendorDates');
            const currentUsernames = pdfFiles.map(f => f.name.replace(/\.pdf$/i, ''));
            setAcceptedVendors(savedAccepted ? JSON.parse(savedAccepted).filter((name: string) => currentUsernames.includes(name)) : []);
            setRejectedVendors(savedRejected ? JSON.parse(savedRejected).filter((name: string) => currentUsernames.includes(name)) : []);
            setAcceptedVendorDates(savedDates ? JSON.parse(savedDates) : {});
        }
        syncVendors();
        window.addEventListener('storage', syncVendors);
        return () => window.removeEventListener('storage', syncVendors);
    }, [pdfFiles]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AppLayout>
            <Head title="Vendor Dashboard" />

            {/* Vendor Application Portal Banner */}
            <div className="w-full flex flex-col items-center justify-center py-8 bg-yellow-100 border-b border-yellow-300 mb-8 rounded-xl shadow">
                <h1 className="text-4xl font-extrabold text-black mb-2">Vendor Application Portal</h1>
                <p className="text-lg text-black">You can be a potential Vendor.<br />Apply day, Apply now</p>
            </div>

            {/* Notification (top-right corner) */}
            {isVisible && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-out">
                        <span className="font-medium">This page is a step for those<br />who want to become vendors.</span>
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[60vh]">
                        {/* First column: Application Download, tyui, fght */}
                        <div className="flex flex-col gap-8">
                            {/* Application Download Card */}
                            <div className="max-w-md w-full">
                                <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center h-full">
                                    <div className="text-2xl font-bold text-white mb-2">Application Download</div>
                                    <div className="text-white/90 text-center mb-2">Click the button below to download the application template (apptemplate.docx)</div>
                                    <form method="GET" action="http://localhost:8080/download/apptemplate">
                                        <button type="submit" className="mt-2 px-6 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-100 transition-colors">
                                            Download Template
                                        </button>
                                    </form>
                                </div>
                            </div>
                            {/* Tyui Card */}
                            <div className="max-w-md w-full">
                                <div className="bg-gradient-to-br from-orange-700 via-orange-800 to-orange-900 text-white rounded-xl shadow-md p-6 flex flex-col items-center h-full">
                                    <div className="flex items-center gap-3 w-full justify-center">
                                        <span className="w-12 h-12 bg-orange-800 rounded-full flex items-center justify-center text-2xl font-bold text-white drop-shadow-lg shrink-0">
                                            <ThumbsUp className="w-8 h-8 text-white" />
                                        </span>
                                        <div className="text-2xl font-bold text-white mb-2">Verified Vendors</div>
                                    </div>
                                    <div className="text-white text-center mb-2">You are required to visit company on the allocated date</div>
                                    {acceptedVendors.length > 0 && (
                                        <div className="w-full">
                                            <div className="font-semibold text-white mb-2">Accepted Vendors:</div>
                                            <ul className="list-disc list-inside text-white">
                                                {acceptedVendors.map((name) => (
                                                    <li key={name}>
                                                        {name}
                                                        {acceptedVendorDates[name] && (
                                                            <span className="ml-2 text-orange-200 text-sm">(Visit Date: {acceptedVendorDates[name]} 10:10am)</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Fght Card */}
                            <div className="max-w-md w-full">
                                <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 text-white rounded-xl shadow-md p-6 flex flex-col items-center h-full">
                                    <div className="flex items-center gap-3 w-full justify-center">
                                        <span className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white drop-shadow-lg shrink-0">
                                            <ThumbsDown className="w-8 h-8 text-white" />
                                        </span>
                                        <div className="text-2xl font-bold text-white mb-2">Rejected Applications</div>
                                    </div>
                                    <div className="text-white text-center mb-2">This may be as a result of incomplete information. Thank you for showing interest</div>
                                    {rejectedVendors.length > 0 && (
                                        <div className="w-full">
                                            <div className="font-semibold text-white mb-2">Unqualified Vendors:</div>
                                            <ul className="list-disc list-inside text-white">
                                                {rejectedVendors.map((name) => (
                                                    <li key={name}>{name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Second column: Application Submission */}
                        <div className="flex flex-col justify-center h-full">
                            {/* Application Submission Card */}
                            <div className="max-w-md w-full">
                                <div className="bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center h-full">
                                    <div className="text-2xl font-bold text-white mb-2">Application Submission</div>
                                    <div className="text-white/90 text-center mb-2">Save your application as "username.pdf" before proceeding. Fill in your details and upload your application as a PDF file.</div>
                                    <form
                                        method="POST"
                                        action="http://localhost:8080/upload"
                                        encType="multipart/form-data"
                                        target="_blank"
                                        className="flex flex-col gap-4 w-full bg-white/10 rounded-xl shadow p-6 mt-4"
                                    >
                                        <label className="font-medium text-white">PDF File
                                            <input type="file" name="file" accept="application/pdf" required className="block mt-2 w-full border border-gray-300 rounded-lg p-2 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 file:bg-red-500 file:hover:bg-red-700 file:text-white file:font-semibold file:px-4 file:py-2 file:rounded file:border-0 file:transition-colors" />
                                        </label>
                                        <label className="font-medium text-white">Full Name
                                            <input type="text" name="full_name" required placeholder="Enter your full name" className="block mt-2 w-full border border-gray-300 rounded-lg p-2 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400" />
                                        </label>
                                        <label className="font-medium text-white">Account Balance
                                            <input type="number" name="account_balance" required placeholder="e.g. 500000" className="block mt-2 w-full border border-gray-300 rounded-lg p-2 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400" />
                                        </label>
                                        <label className="font-medium text-white">Age
                                            <input type="number" name="age" required placeholder="e.g. 30" className="block mt-2 w-full border border-gray-300 rounded-lg p-2 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400" />
                                        </label>
                                        <label className="font-medium text-white">Financial Stability
                                            <select name="financial_stability" required className="block mt-2 w-full border border-gray-300 rounded-lg p-2 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400">
                                                <option value="">Select...</option>
                                                <option value="good">Good</option>
                                                <option value="fair">Fair</option>
                                                <option value="bad">Bad</option>
                                            </select>
                                        </label>
                                        <button type="submit" className="mt-4 px-6 py-3 bg-white text-green-700 rounded-lg shadow hover:bg-green-100 transition font-semibold text-lg w-full">Upload PDF</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
} 