import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';

function getDashboardReport(dashboard: string) {
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
        case 'admin':
            return (
                <div className="bg-pink-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Admin Report</h2>
                    <p>System operations, vendor approvals, and user management reports go here.</p>
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

    return (
        <AppLayout>
            <div>
                <Head title="Report" />
                <div className="container mx-auto px-4 py-8">
                    <div className="w-full bg-white py-6 px-4 shadow rounded mb-6">
                        <h1 className="text-3xl font-bold text-purple-800 m-0">Report</h1>
                    </div>
                    {getDashboardReport(dashboard)}
                </div>
            </div>
        </AppLayout>
    );
} 