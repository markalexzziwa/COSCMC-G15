import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import React, { useRef } from 'react';

function getDashboardReport(dashboard: string) {
    const reportRef = useRef<HTMLDivElement>(null);
    if (dashboard === 'admin') {
        // Get accepted/rejected vendors and workforce tasks from localStorage
        let acceptedVendors: string[] = [];
        let rejectedVendors: string[] = [];
        let acceptedVendorDates: { [username: string]: string } = {};
        let workforceTasks: { name: string; contact: string; department: string; task: string }[] = [];
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('acceptedVendors');
            acceptedVendors = saved ? JSON.parse(saved) : [];
            const savedRejected = localStorage.getItem('rejectedVendors');
            rejectedVendors = savedRejected ? JSON.parse(savedRejected) : [];
            const savedDates = localStorage.getItem('acceptedVendorDates');
            acceptedVendorDates = savedDates ? JSON.parse(savedDates) : {};
            const savedTasks = localStorage.getItem('workforceTasks');
            workforceTasks = savedTasks ? JSON.parse(savedTasks) : [];
        }
        const handlePrint = () => {
            if (reportRef.current) {
                const printContents = reportRef.current.innerHTML;
                const originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
                window.location.reload(); // reload to restore event handlers
            }
        };
        return (
            <div ref={reportRef} className="bg-blue-50 p-6 rounded shadow">
                <div className="flex justify-center mb-6">
                    <img src="/apple-touch-icon.png" alt="CK-OILS Logo" className="h-20 w-20" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Admin Report</h2>
                <p className="mb-6">System operations, vendor approvals, and user management reports.</p>
                {/* Summary Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded p-4 text-center">
                            <div className="text-3xl font-bold text-blue-900">{acceptedVendors.length}</div>
                            <div className="text-gray-700 mt-1">Accepted Applications</div>
                        </div>
                        <div className="bg-white rounded p-4 text-center">
                            <div className="text-3xl font-bold text-blue-900">{rejectedVendors.length}</div>
                            <div className="text-gray-700 mt-1">Rejected Applications</div>
                        </div>
                        <div className="bg-white rounded p-4 text-center">
                            <div className="text-3xl font-bold text-blue-900">{workforceTasks.length}</div>
                            <div className="text-gray-700 mt-1">Workforce Tasks</div>
                        </div>
                    </div>
                </div>
                {/* Accepted Vendors Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">Accepted Applications</h3>
                    {acceptedVendors.length > 0 ? (
                        <ul className="list-disc list-inside bg-white rounded p-4">
                            {acceptedVendors.map((name) => (
                                <li key={name} className="mb-1">
                                    {name}
                                    {acceptedVendorDates[name] && (
                                        <span className="ml-2 text-orange-600 text-sm">(Visit Date: {acceptedVendorDates[name]} 10:10am)</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-500">No accepted vendors yet.</div>
                    )}
                </div>
                {/* Rejected Vendors Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">Rejected Applications</h3>
                    {rejectedVendors.length > 0 ? (
                        <ul className="list-disc list-inside bg-white rounded p-4">
                            {rejectedVendors.map((name) => (
                                <li key={name} className="mb-1">
                                    {name}
                                    {acceptedVendorDates[name] && (
                                        <span className="ml-2 text-orange-600 text-sm">(Visit Date: {acceptedVendorDates[name]} 10:10am)</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-500">No rejected vendors yet.</div>
                    )}
                </div>
                {/* Workforce Table Section */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">Workforce Task Assignments</h3>
                    {workforceTasks.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Contact</th>
                                        <th className="px-4 py-2 text-left">Department</th>
                                        <th className="px-4 py-2 text-left">Task</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workforceTasks.map((row, idx) => (
                                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                            <td className="px-4 py-2">{row.name}</td>
                                            <td className="px-4 py-2">{row.contact}</td>
                                            <td className="px-4 py-2">{row.department}</td>
                                            <td className="px-4 py-2">{row.task}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-gray-500">No workforce tasks assigned yet.</div>
                    )}
                </div>
            </div>
        );
    }
    switch (dashboard) {
        case 'manufacturer':
            return (
                <div className="bg-blue-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Manufacturer Report</h2>
                    <p>Production, supply chain, and factory performance reports go here.</p>
                </div>
            );
        case 'retail':
            return (
                <div className="bg-green-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Retail Report</h2>
                    <p>Sales, customer trends, and inventory reports go here.</p>
                </div>
            );
        case 'distributor':
            return (
                <div className="bg-yellow-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Distributor Report</h2>
                    <p>Distribution, logistics, and delivery reports go here.</p>
                </div>
            );
        case 'customer':
            return (
                <div className="bg-blue-100 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Customer Report</h2>
                    <p>Order history, preferences, and engagement reports go here.</p>
                </div>
            );
        case 'factory-store':
            return (
                <div className="bg-purple-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Factory Store Report</h2>
                    <p>Stock, packaging, and supply reports go here.</p>
                </div>
            );
        case 'farmer':
            return (
                <div className="bg-orange-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Farmer Report</h2>
                    <p>Yield, harvest, and farm performance reports go here.</p>
                </div>
            );
        case 'inventory-manager':
            return (
                <div className="bg-teal-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Inventory Manager Report</h2>
                    <p>Inventory levels, restocking, and supply chain reports go here.</p>
                </div>
            );
        case 'unofficial-vendor':
            return (
                <div className="bg-gray-100 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Unofficial Vendor Report</h2>
                    <p>Vendor application, approval status, and feedback reports go here.</p>
                </div>
            );
        default:
            return (
                <div className="bg-gray-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">General Report</h2>
                    <p>General report content. Log in as a specific user to see a tailored report.</p>
                </div>
            );
    }
}

export default function Report() {
    const { dashboard: dashboardProp } = usePage().props as { dashboard?: string };
    const dashboard = dashboardProp || '';
    // For print preview and PDF
    const reportRef = useRef<HTMLDivElement>(null);
    // Get accepted/rejected vendors and workforce tasks from localStorage for button logic
    let acceptedVendors: string[] = [];
    let rejectedVendors: string[] = [];
    let workforceTasks: { name: string; contact: string; department: string; task: string }[] = [];
    if (typeof window !== 'undefined' && dashboard === 'admin') {
        const saved = localStorage.getItem('acceptedVendors');
        acceptedVendors = saved ? JSON.parse(saved) : [];
        const savedRejected = localStorage.getItem('rejectedVendors');
        rejectedVendors = savedRejected ? JSON.parse(savedRejected) : [];
        const savedTasks = localStorage.getItem('workforceTasks');
        workforceTasks = savedTasks ? JSON.parse(savedTasks) : [];
    }
    const handlePrint = () => {
        if (reportRef.current) {
            const printContents = reportRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
    };
    return (
        <AppLayout>
            <div>
                <Head title="Report" />
                <div className="container mx-auto px-4 py-8 relative">
                    {/* Buttons in upper right, outside report */}
                    {dashboard === 'admin' && (
                        <div className="absolute right-6 top-0 flex gap-4 z-10 print:hidden">
                            <button onClick={handlePrint} className="px-6 py-2 rounded bg-green-700 text-white font-semibold hover:bg-green-700 transition-colors">Print Report</button>
                        </div>
                    )}
                    {/* Pass ref to report content for print */}
                    <div ref={dashboard === 'admin' ? reportRef : undefined}>
                        {getDashboardReport(dashboard)}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 