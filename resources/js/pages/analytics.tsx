import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

// Initial production data
const initialProductionData = [
    { date: '2025-07-01', 'Cooking Oil': 400, Shampoo: 240, Margarine: 300 },
    { date: '2025-07-02', 'Cooking Oil': 300, Shampoo: 139, Margarine: 450 },
    { date: '2025-07-03', 'Cooking Oil': 200, Shampoo: 240, Margarine: 200 },
    { date: '2025-07-04', 'Cooking Oil': 278, Shampoo: 390, Margarine: 350 },
    { date: '2025-07-05', 'Cooking Oil': 189, Shampoo: 480, Margarine: 250 },
    { date: '2025-07-06', 'Cooking Oil': 239, Shampoo: 380, Margarine: 280 },
    { date: '2025-07-07', 'Cooking Oil': 349, Shampoo: 430, Margarine: 210 },
];

function AddProductionDataCard({ onAddData }: { onAddData: (data: { date: string, product: string, quantity: number }) => void }) {
    const [date, setDate] = useState('');
    const [product, setProduct] = useState('Cooking Oil');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddData({
            date,
            product,
            quantity: parseInt(quantity, 10),
        });
        setDate('');
        setProduct('Cooking Oil');
        setQuantity('');
    };

    return (
        <div className="bg-white rounded shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Add Production Data</h3>
            <p className="mb-6 text-gray-600">Add a new production entry to update the charts.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="h-12" />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="product" className="text-sm font-medium">Product</Label>
                    <Select value={product} onValueChange={setProduct}>
                        <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Cooking Oil">Cooking Oil</SelectItem>
                            <SelectItem value="Shampoo">Shampoo</SelectItem>
                            <SelectItem value="Margarine">Margarine</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-3">
                    <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                    <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="h-12" />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium">Add Entry</Button>
            </form>
        </div>
    );
}

function getDashboardAnalytics(dashboard: string) {
    const [productionData, setProductionData] = useState(initialProductionData);
    const [notification, setNotification] = useState<string | null>(null);

    // Calculate analytics data based on current production data
    const analyticsData = useMemo(() => {
        const productNames = productionData.length > 0 ? Object.keys(productionData[0]).filter(key => key !== 'date') : [];
        const totalProduction = productNames.reduce((acc, productName) => {
            acc[productName] = productionData.reduce((sum, entry) => sum + ((entry as any)[productName] || 0), 0);
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(totalProduction).map(([name, value]) => ({ name, value }));
    }, [productionData]);

    // Calculate average production
    const { averageProduction, productNames, totalProduction } = useMemo(() => {
        const productNames = productionData.length > 0 ? Object.keys(productionData[0]).filter(key => key !== 'date') : [];
        const totalProduction = productNames.reduce((acc, productName) => {
            acc[productName] = productionData.reduce((sum, entry) => sum + ((entry as any)[productName] || 0), 0);
            return acc;
        }, {} as Record<string, number>);
        const averageProduction = productNames.reduce((acc, productName) => {
            const total = totalProduction[productName];
            const count = productionData.filter(entry => ((entry as any)[productName] || 0) > 0).length;
            acc[productName] = count > 0 ? total / count : 0;
            return acc;
        }, {} as Record<string, number>);

        return { totalProduction, averageProduction, productNames };
    }, [productionData]);

    const handleAddProductionData = (newData: { date: string; product: string; quantity: number }) => {
        setProductionData(prevData => {
            const existingEntryIndex = prevData.findIndex(d => d.date === newData.date);

            if (existingEntryIndex > -1) {
                // Update existing date entry
                const updatedData = [...prevData];
                const existingEntry = updatedData[existingEntryIndex];
                const newQuantity = (existingEntry[newData.product as keyof typeof existingEntry] || 0) as number + newData.quantity;

                updatedData[existingEntryIndex] = {
                    ...existingEntry,
                    [newData.product]: newQuantity,
                };
                return updatedData;
            } else {
                // Add new date entry
                const newEntry = {
                    date: newData.date,
                    'Cooking Oil': 0,
                    Shampoo: 0,
                    Margarine: 0,
                    [newData.product]: newData.quantity,
                };
                return [...prevData, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            }
        });
        setNotification(`Added ${newData.quantity} units of ${newData.product} for ${newData.date}`);
        setTimeout(() => setNotification(null), 3000);
    };

    switch (dashboard) {
        case 'manufacturer':
            return (
                <div className="bg-blue-50 p-6 rounded shadow">
                    {notification && (
                        <div className="fixed top-24 right-5 z-50 rounded-md bg-green-500 p-4 text-white shadow-lg animate-in fade-in-0 slide-in-from-top-5">
                            {notification}
                        </div>
                    )}
                    <h2 className="text-2xl font-bold mb-2">Manufacturer Analytics</h2>
                    <p>Production, supply chain, and factory performance analytics go here.</p>
                    
                    {/* Production Analytics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-white rounded shadow p-4">
                                <h3 className="text-xl font-semibold mb-2">Production Analytics</h3>
                                <p className="mb-4 text-gray-600">Total production distribution.</p>
                                <div className="h-[400px] w-full">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={analyticsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                                {analyticsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="bg-white rounded shadow p-4">
                                <h3 className="text-xl font-semibold mb-2">Average Production</h3>
                                <p className="mb-4 text-gray-600">Average production per product.</p>
                            <div className="h-[400px] w-full flex items-center justify-center">
                                <ul className="space-y-4 text-lg">
                                    {Object.entries(averageProduction).map(([name, avg]) => (
                                        <li key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">{name}</span>
                                            <strong className="text-xl">{avg.toFixed(2)}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    

                    {/* Production Charts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="md:col-span-2 grid grid-cols-1 gap-6">
                        <div className="bg-white rounded shadow p-4">
                            <h3 className="text-xl font-semibold mb-2">Production Bar Chart</h3>
                            <p className="mb-4 text-gray-600">Daily production quantities of different products.</p>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer>
                                    <BarChart data={productionData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Cooking Oil" fill="#3b82f6" />
                                        <Bar dataKey="Shampoo" fill="#10b981" />
                                        <Bar dataKey="Margarine" fill="#f59e0b" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-white rounded shadow p-4">
                            <h3 className="text-xl font-semibold mb-2">Production Line Chart</h3>
                            <p className="mb-4 text-gray-600">Daily production trends of different products.</p>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer>
                                    <LineChart data={productionData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="Cooking Oil" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="Shampoo" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="Margarine" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        </div>
                        <div className="md:col-span-1 flex items-center">
                            <AddProductionDataCard onAddData={handleAddProductionData} />
                        </div>
                    </div>

                    {/* Production Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {productNames.map((productName, index) => (
                            <div key={productName} className="bg-white rounded shadow p-4">
                                <h3 className="text-lg font-semibold mb-2">{productName} Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Total Production:</span>
                                        <strong>{totalProduction[productName]}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Daily:</span>
                                        <strong>{averageProduction[productName].toFixed(2)}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Days with Data:</span>
                                        <strong>{productionData.filter(entry => ((entry as any)[productName] || 0) > 0).length}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'retail':
            return (
                <div className="bg-green-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Retail Analytics</h2>
                    <p>Sales, customer trends, and inventory analytics go here.</p>
                </div>
            );
        case 'distributor':
            return (
                <div className="bg-yellow-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Distributor Analytics</h2>
                    <p>Distribution, logistics, and delivery analytics go here.</p>
                </div>
            );
        case 'admin':
            // Get data from localStorage
            let acceptedVendors: string[] = [];
            let rejectedVendors: string[] = [];
            let pdfFiles: { name: string }[] = [];
            let workforceTasks: { date?: string; department?: string }[] = [];
            if (typeof window !== 'undefined') {
                acceptedVendors = JSON.parse(localStorage.getItem('acceptedVendors') || '[]');
                rejectedVendors = JSON.parse(localStorage.getItem('rejectedVendors') || '[]');
                pdfFiles = JSON.parse(localStorage.getItem('pdfFiles') || '[]');
                workforceTasks = JSON.parse(localStorage.getItem('workforceTasks') || '[]');
            }
            // Pie chart data for submitted vs processed applications
            const processedCount = acceptedVendors.length + rejectedVendors.length;
            const submittedCount = pdfFiles.length;
            const unprocessedCount = submittedCount - processedCount;
            const submissionPieData = [
                { name: 'No Feedback', value: submittedCount },
                { name: 'Given feedback', value: processedCount },
            ];
            // Pie chart data for viewed/unviewed
            const viewedCount = pdfFiles.filter((f: { name: string }) => acceptedVendors.includes(f.name.replace(/\.pdf$/i, '')) || rejectedVendors.includes(f.name.replace(/\.pdf$/i, ''))).length;
            const unviewedCount = pdfFiles.length - viewedCount;
            const viewedPieData = [
                { name: 'Viewed', value: viewedCount },
                { name: 'Unviewed', value: unviewedCount },
            ];
            // Pie chart data for accepted/rejected
            const acceptedPieData = [
                { name: 'Accepted', value: acceptedVendors.length },
                { name: 'Rejected', value: rejectedVendors.length },
            ];
            // Line graph data for workforce tasks over time
            type WorkforceLine = { date: string; count: number };
            const workforceLineData: WorkforceLine[] = [];
            const dateCountMap: Record<string, number> = {};
            workforceTasks.forEach((task: { date?: string }) => {
                const date = task.date || 'Unknown';
                dateCountMap[date] = (dateCountMap[date] || 0) + 1;
            });
            Object.entries(dateCountMap).forEach(([date, count]) => {
                workforceLineData.push({ date, count });
            });
            workforceLineData.sort((a, b) => {
                if (a.date === 'Unknown') return 1;
                if (b.date === 'Unknown') return -1;
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            // Bar graph data for department vs number of workforce
            type DepartmentBar = { department: string; count: number };
            const departmentCountMap: Record<string, number> = {};
            workforceTasks.forEach((task: { department?: string }) => {
                const dept = task.department || 'Unknown';
                departmentCountMap[dept] = (departmentCountMap[dept] || 0) + 1;
            });
            const departmentBarData: DepartmentBar[] = Object.entries(departmentCountMap).map(([department, count]) => ({ department, count }));
            // Pie chart data for feedback provided/unprovided
            // Assume feedback is provided if the application is in accepted or rejected
            const feedbackCount = pdfFiles.filter((f: { name: string }) =>
                acceptedVendors.includes(f.name.replace(/\.pdf$/i, '')) ||
                rejectedVendors.includes(f.name.replace(/\.pdf$/i, ''))
            ).length;
            const noFeedbackCount = pdfFiles.length - feedbackCount;
            const feedbackPieData = [
                { name: 'Provided Feedback', value: feedbackCount },
                { name: 'No Feedback', value: noFeedbackCount },
            ];
            // Approval rate percentage
            const approvalRate = processedCount > 0 ? (acceptedVendors.length / processedCount) * 100 : 0;
            // Percentages for accepted and rejected
            const totalProcessed = acceptedVendors.length + rejectedVendors.length;
            const acceptedPercent = totalProcessed > 0 ? (acceptedVendors.length / totalProcessed) * 100 : 0;
            const rejectedPercent = totalProcessed > 0 ? (rejectedVendors.length / totalProcessed) * 100 : 0;
            // Approval rate percentage (portion of 'Given feedback' in the pie chart)
            const approvalRatePieTotal = processedCount + noFeedbackCount;
            const approvalRatePiePercent = approvalRatePieTotal > 0 ? (processedCount / approvalRatePieTotal) * 100 : 0;
            return (
                <div className="bg-blue-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Admin Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {/* Pie chart for approval rate */}
                        <div className="bg-white rounded shadow p-4">
                            <h3 className="text-xl font-semibold mb-2">Approval rate</h3>
                            <div className="text-3xl font-bold mb-2" style={{ color: '#10b981' }}>{approvalRatePieTotal > 0 ? `${approvalRatePiePercent.toFixed(1)}%` : 'N/A'}</div>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={submissionPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        <Cell fill="#3b82f6" />
                                        <Cell fill="#10b981" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Pie chart for accepted/rejected */}
                        <div className="bg-white rounded shadow p-4">
                            <h3 className="text-xl font-semibold mb-2">Accepted vs Rejected</h3>
                            <div className="flex items-center justify-center gap-6 mb-2">
                                <span className="text-2xl font-bold" style={{ color: '#3b82f6' }}>Accepted: {totalProcessed > 0 ? `${acceptedPercent.toFixed(1)}%` : 'N/A'}</span>
                                <span className="text-2xl font-bold" style={{ color: '#ef4444' }}>Rejected: {totalProcessed > 0 ? `${rejectedPercent.toFixed(1)}%` : 'N/A'}</span>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={acceptedPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        <Cell fill="#3b82f6" />
                                        <Cell fill="#ef4444" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Bar graph for department vs number of workforce */}
                        <div className="bg-white rounded shadow p-4">
                            <h3 className="text-xl font-semibold mb-2">Workforce by Department</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={departmentBarData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="department" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            );
        case 'customer':
            return (
                <div className="bg-blue-100 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Customer Analytics</h2>
                    <p>Order history, preferences, and engagement analytics go here.</p>
                </div>
            );
        case 'factory-store':
            return (
                <div className="bg-purple-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Factory Store Analytics</h2>
                    <p>Stock, packaging, and supply analytics go here.</p>
                </div>
            );
        case 'farmer':
            return (
                <div className="bg-orange-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Farmer Analytics</h2>
                    <p>Yield, harvest, and farm performance analytics go here.</p>
                </div>
            );
        case 'inventory-manager':
            return (
                <div className="bg-teal-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Inventory Manager Analytics</h2>
                    <p>Inventory levels, restocking, and supply chain analytics go here.</p>
                </div>
            );
        case 'unofficial-vendor':
            return (
                <div className="bg-gray-100 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Unofficial Vendor Analytics</h2>
                    <p>Vendor application, approval status, and feedback analytics go here.</p>
                </div>
            );
        default:
            return (
                <div className="bg-gray-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">General Analytics</h2>
                    <p>General analytics content. Select a dashboard to see specific analytics.</p>
                </div>
            );
    }
}

export default function Analytics() {
    // Prefer the dashboard prop from Inertia, fallback to query string
    const { dashboard: dashboardProp } = usePage().props as { dashboard?: string };
    const dashboard = dashboardProp || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('dashboard') || '' : '');

    return (
        <AppLayout>
            <div>
                <Head title="Analytics" />
                <div className="container mx-auto px-4 py-8">
                    {getDashboardAnalytics(dashboard)}
                </div>
            </div>
        </AppLayout>
    );
} 