import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import React, { useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line } from 'recharts';
import useStockStore from '@/store/useStockStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DistributorStockDistributionCard from '@/components/distributor-stock-distribution-card';
import DistributorStockByStatusCard from '@/components/distributor-stock-by-status-card';

// Add this component at the top-level (before getDashboardReport):
function DistributorOrdersLineGraphCard() {
    const [orders, setOrders] = React.useState<any[]>([]);
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('distributorOrders');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setOrders(Array.isArray(parsed) ? parsed.slice(-6) : []);
                } catch {
                    setOrders([]);
                }
            }
        }
    }, []);
    // Prepare data for line chart
    const chartData = orders.map(order => {
        const data: any = { date: new Date(order.date).toLocaleDateString() };
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
                data[item.name] = item.quantity;
            });
        }
        return data;
    });
    return (
        <div className="bg-white rounded shadow p-6 mb-8">
            <h3 className="text-xl font-semibold mb-2">Distributor Orders (Last 6 Orders)</h3>
            <p className="mb-4 text-gray-600">Line graph of product quantities in the last 6 distributor orders.</p>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Cooking Oil" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} name="Cooking Oil" />
                        <Line type="monotone" dataKey="Shampoo" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} name="Shampoo" />
                        <Line type="monotone" dataKey="Soft Margarine" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} name="Soft Margarine" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Add this component at the top-level (before getDashboardReport):
function DistributorOrdersForecastCard() {
    // Use the same logic as in analytics
    const [orders, setOrders] = React.useState<any[]>([]);
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('distributorOrders');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setOrders(Array.isArray(parsed) ? parsed.slice(-6) : []);
                } catch {
                    setOrders([]);
                }
            }
        }
    }, []);
    // Prepare data for line chart
    const chartData = orders.map(order => {
        const data: any = { date: new Date(order.date).toLocaleDateString() };
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
                data[item.name] = item.quantity;
            });
        }
        return data;
    });
    function linearForecast(values: number[]) {
        const n = values.length;
        if (n < 2) return values[n - 1] || 0;
        const xSum = (n * (n - 1)) / 2;
        const ySum = values.reduce((a, b) => a + b, 0);
        const xxSum = (n * (n - 1) * (2 * n - 1)) / 6;
        const xySum = values.reduce((sum, y, i) => sum + i * y, 0);
        const denominator = n * xxSum - xSum * xSum;
        if (denominator === 0) return values[n - 1] || 0;
        const slope = (n * xySum - xSum * ySum) / denominator;
        const intercept = (ySum - slope * xSum) / n;
        return Math.round(slope * n + intercept);
    }
    const productNames = ['Cooking Oil', 'Shampoo', 'Soft Margarine'];
    const forecasts: { [key: string]: number } = {};
    productNames.forEach(name => {
        const vals = chartData.map(d => d[name] ?? 0);
        forecasts[name] = linearForecast(vals);
    });
    return (
        <div className="w-full flex flex-row items-center justify-center mb-8">
            <div className="w-full max-w-xs flex flex-col items-center justify-center">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 text-xs rounded px-4 py-3 shadow font-semibold w-full">
                    <div className="text-base font-bold mb-1">Expected future Demand</div>
                    {productNames.map((name) => {
                        const vals = chartData.map(d => d[name] ?? 0);
                        const lastVal = vals.length > 0 ? vals[vals.length - 1] : 0;
                        const forecastVal = forecasts[name];
                        let arrow = null;
                        if (forecastVal > lastVal) {
                            arrow = <span className="ml-1 text-green-600" title="Up">▲</span>;
                        } else if (forecastVal < lastVal) {
                            arrow = <span className="ml-1 text-red-600" title="Down">▼</span>;
                        }
                        return (
                            <div key={name} className="mb-1 flex justify-between items-center">
                                <span>{name}:</span>
                                <span className="font-mono flex items-center">{forecastVal}{arrow}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function getDashboardReport(dashboard: string) {
    const reportRef = useRef<HTMLDivElement>(null);
    
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
        return (
            <div ref={reportRef} className="bg-blue-50 p-6 rounded shadow">
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
                <DistributorOrdersForecastCard />
                {/* Distributor Orders (Last 6 Orders) Line Graph Card */}
                <DistributorOrdersLineGraphCard />
                {/* Accepted Vendors Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">Accepted Applications</h3>
                    {acceptedVendors.length > 0 ? (
                        <ul className="list-disc list-inside bg-white rounded p-4">
                            {acceptedVendors.map((name) => (
                                <li key={name} className="mb-1">
                                    {name}
                                    {acceptedVendorDates[name] && (
                                        <span className="ml-2 text-orange-600 text-sm font-bold">(Visit Date: {acceptedVendorDates[name]} 10:10am)</span>
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
                                        <span className="ml-2 text-orange-900 text-sm font-bold">(Visit Date: {acceptedVendorDates[name]} 10:10am)</span>
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
            // Get production data from localStorage
            let productionRecords: any[] = [];
            if (typeof window !== 'undefined') {
                const savedRecords = localStorage.getItem('manufacturerProductionRecords');
                productionRecords = savedRecords ? JSON.parse(savedRecords) : [];
            }

            // Get today's date
            const today = new Date().toISOString().split('T')[0];
            
            // Filter today's records
            const todaysRecords = productionRecords.filter(record => record.date === today);
            
            // Calculate production analytics
            const totalProduction = todaysRecords.reduce((total, record) => total + record.quantity, 0);
            const productionByProduct = todaysRecords.reduce((acc, record) => {
                if (!acc[record.productName]) {
                    acc[record.productName] = { total: 0, entries: 0 };
                }
                acc[record.productName].total += record.quantity;
                acc[record.productName].entries += 1;
                return acc;
            }, {} as Record<string, { total: number; entries: number }>);

            // Calculate average production
            const averageProduction = Object.entries(productionByProduct).reduce((acc, [productName, data]) => {
                acc[productName] = (data as { total: number; entries: number }).entries > 0 ? (data as { total: number; entries: number }).total / (data as { total: number; entries: number }).entries : 0;
                return acc;
            }, {} as Record<string, number>);

            // Create production line data (last 7 days)
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toISOString().split('T')[0];
            }).reverse();

            const productionLineData = last7Days.map(date => {
                const dayRecords = productionRecords.filter(record => record.date === date);
                const dayTotal = dayRecords.reduce((total, record) => total + record.quantity, 0);
                return {
                    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    total: dayTotal,
                    'Cooking Oil': dayRecords.filter(r => r.productName === 'Cooking Oil').reduce((sum, r) => sum + r.quantity, 0),
                    'Shampoo': dayRecords.filter(r => r.productName === 'Shampoo').reduce((sum, r) => sum + r.quantity, 0),
                    'Margarine': dayRecords.filter(r => r.productName === 'Margarine').reduce((sum, r) => sum + r.quantity, 0),
                };
            });

            return (
                <div ref={reportRef} className="bg-blue-50 p-6 rounded shadow">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex justify-center">
                        <img src="/apple-touch-icon.png" alt="CK-OILS Logo" className="h-20 w-20" />
                        </div>
                        <button
                            onClick={handlePrint}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                            <span>🖨️</span>
                            <span>Print Report</span>
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Manufacturer Report</h2>
                    <p className="mb-6">System operations, vendor approvals, and user management reports.</p>
                    {/* Products Order History Card (synced with factory store) */}
                    <FactoryProductionOrderHistoryCardReport />
                    
                    {/* Last 24 Hours Production Request */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Last 24 Hours Production Request</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-200">
                                <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-blue-700 mb-2">
                                        Cooking Oil: {(() => {
                                            const orders = JSON.parse(localStorage.getItem('factoryProductionOrders') || '[]');
                                            return orders.reduce((total: number, order: any) => {
                                                if (order.items) {
                                                    const productItem = order.items.find((item: any) => 
                                                        item.name.toLowerCase().includes('cooking oil')
                                                    );
                                                    if (productItem) {
                                                        return total + (parseInt(productItem.quantity) || 0);
                                                    }
                                                }
                                                return total;
                                            }, 0);
                                        })()} Jellycan
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Needed</span>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-200">
                                <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-blue-700 mb-2">
                                        Shampoo: {(() => {
                                            const orders = JSON.parse(localStorage.getItem('factoryProductionOrders') || '[]');
                                            return orders.reduce((total: number, order: any) => {
                                                if (order.items) {
                                                    const productItem = order.items.find((item: any) => 
                                                        item.name.toLowerCase().includes('shampoo')
                                                    );
                                                    if (productItem) {
                                                        return total + (parseInt(productItem.quantity) || 0);
                                                    }
                                                }
                                                return total;
                                            }, 0);
                                        })()} Bottles
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Needed</span>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-200">
                                <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-blue-700 mb-2">
                                        Soft Margarine: {(() => {
                                            const orders = JSON.parse(localStorage.getItem('factoryProductionOrders') || '[]');
                                            return orders.reduce((total: number, order: any) => {
                                                if (order.items) {
                                                    const productItem = order.items.find((item: any) => 
                                                        item.name.toLowerCase().includes('soft margarine') || item.name.toLowerCase().includes('margarine')
                                                    );
                                                    if (productItem) {
                                                        return total + (parseInt(productItem.quantity) || 0);
                                                    }
                                                }
                                                return total;
                                            }, 0);
                                        })()} Tubes
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Needed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Production Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded p-4 text-center border border-blue-200">
                                <div className="text-3xl font-bold text-blue-600">
                                    {totalProduction.toLocaleString()}
                                </div>
                                <div className="text-gray-700 mt-1">Total Production</div>
                            </div>
                            <div className="bg-white rounded p-4 text-center border border-blue-200">
                                <div className="text-3xl font-bold text-blue-600">
                                    {todaysRecords.length}
                                </div>
                                <div className="text-gray-700 mt-1">Production Entries</div>
                            </div>
                            <div className="bg-white rounded p-4 text-center border border-blue-200">
                                <div className="text-3xl font-bold text-blue-600">
                                    {Object.keys(productionByProduct).length}
                                </div>
                                <div className="text-gray-700 mt-1">Active Products</div>
                            </div>
                            <div className="bg-white rounded p-4 text-center border border-blue-200">
                                <div className="text-3xl font-bold text-blue-600">
                                    {todaysRecords.length > 0 ? 
                                        new Date(todaysRecords[todaysRecords.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                                        'N/A'
                                    }
                                </div>
                                <div className="text-gray-700 mt-1">Last Entry</div>
                            </div>
                        </div>
                    </div>

                    {/* Average Production Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Average Production by Product</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(averageProduction).map(([productName, average]) => (
                                <div key={productName} className="bg-white rounded p-4 border border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{productName}</h4>
                                            <p className="text-sm text-gray-600">Average per entry</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {average.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-500">units</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Production Line Graph */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Production Trends (Last 7 Days)</h3>
                        <div className="bg-white rounded shadow p-4 border border-blue-200">
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={productionLineData}>
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

                    {/* Today's Production Details */}
                    {todaysRecords.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4">Today's Production Details</h3>
                            <div className="bg-white rounded shadow overflow-hidden border border-blue-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-blue-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Quantity</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Unit</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-blue-200">
                                            {todaysRecords
                                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                .map((record, index) => (
                                                    <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.productName}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.quantity.toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.unit}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {new Date(record.timestamp).toLocaleTimeString([], { 
                                                                hour: '2-digit', 
                                                                minute: '2-digit',
                                                                second: '2-digit'
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Report Footer */}
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Report Information</h4>
                        <p className="text-blue-800 text-sm">
                            • <strong>Production Summary:</strong> Overview of today's total production and activity.<br/>
                            • <strong>Average Production:</strong> Average quantity per production entry for each product.<br/>
                            • <strong>Production Trends:</strong> Daily production data for the last 7 days.<br/>
                            • <strong>Data Source:</strong> Real-time data from the manufacturer production system.<br/>
                            • <strong>Report Generated:</strong> {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            );
        case 'retail': {
            // Use localStorage for retail stock
            let retailStock = [
                { id: 1, name: 'Cooking Oil', stock: 200, unit: 'jerrycans', image: '/cooking oil.jpg', category: 'palm-oil' },
                { id: 2, name: 'Shampoo', stock: 130, unit: 'bottles', image: '/shampoo.jpg', category: 'shampoo' },
                { id: 3, name: 'Soft Margarine', stock: 87, unit: 'containers', image: '/soft magarine.jpg', category: 'margarine' },
            ];
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('retailStock');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed)) retailStock = parsed;
                    } catch {}
                } else {
                    localStorage.setItem('retailStock', JSON.stringify(retailStock));
                }
            }
            // Get available customer orders count
            let availableCustomerOrdersCount = 0;
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('customerOrders');
                if (stored) {
                    try {
                        const orders = JSON.parse(stored);
                        availableCustomerOrdersCount = Array.isArray(orders) ? orders.length : 0;
                    } catch {}
                }
            }
            return (
                <div ref={reportRef} className="bg-green-50 p-6 rounded shadow relative">
                    <button
                        onClick={() => window.print()}
                        className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow"
                    >
                        <span role="img" aria-label="print">🖨️</span>
                        <span>Print Preview</span>
                    </button>
                    <RetailDailyWeeklySalesCards />
                    <div className="flex flex-wrap gap-6 justify-center mt-4 mb-8 w-full">
                        {/* Orders Card */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-8 py-4 flex flex-col items-center shadow min-w-[180px] max-w-[220px] text-center">
                            <span className="text-lg font-semibold text-gray-700 mb-1">Orders</span>
                            <span className="text-3xl font-bold text-yellow-700">{availableCustomerOrdersCount}</span>
                        </div>
                        {/* Available Stock Cards */}
                        {retailStock.map(product => (
                            <div key={product.id} className="bg-green-50 border border-green-200 rounded-lg shadow px-8 py-4 flex flex-col items-center min-w-[180px] max-w-[220px]">
                                <span className="text-2xl font-bold text-green-700 mt-1">{product.stock} {product.category === 'shampoo' ? 'bottles' : product.category === 'margarine' ? 'containers' : 'jerrycans'}</span>
                            </div>
                        ))}
                    </div>
                    {/* Product Stock Status Table */}
                    <ProductStockStatusTable stock={retailStock} />
                    {/* Retail Order History */}
                    <RetailOrderHistory />
                    {/* Available Customer Orders Card */}
                    <AvailableCustomerOrdersCard />
                    {/* Bar Graph for Available Retail Stock */}
                    <AvailableRetailStockBarGraph />
                    {/* Summary Cards */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Retail Stock</h3>
                        <div className="bg-white rounded shadow overflow-hidden border border-green-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-green-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-900 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-900 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-900 uppercase tracking-wider">Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-green-200">
                                        {retailStock.map(product => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.unit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Add retail orders card/table here if needed */}
                </div>
            );
        }
        case 'distributor': {
            // Use localStorage for distributor stock (simulate dashboard state)
            let distributorStock = {
                cookingOil: 450,
                shampoo: 280,
                margarine: 320,
            };
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('distributorStock');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (parsed && typeof parsed === 'object') distributorStock = parsed;
                    } catch {}
                }
            }
            // Individual product cards data
            const productCards = [
                { name: 'Cooking Oil', value: distributorStock.cookingOil, unit: 'jerrycans', color: 'bg-yellow-50', text: 'text-yellow-700' },
                { name: 'Shampoo', value: distributorStock.shampoo, unit: 'bottles', color: 'bg-blue-50', text: 'text-blue-700' },
                { name: 'Soft Margarine', value: distributorStock.margarine, unit: 'containers', color: 'bg-green-50', text: 'text-green-700' },
            ];
            return (
                <>
                    <button
                        onClick={() => window.print()}
                        className="fixed top-4 right-4 z-50 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow print:hidden"
                    >
                        <span role="img" aria-label="print">🖨️</span>
                        <span>Print Preview</span>
                    </button>
                    <div className="bg-yellow-50 p-6 rounded shadow">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Distributor Report</h2>
                                <p>Distribution, logistics, and delivery reports go here.</p>
                            </div>
                        </div>
                        {/* Stock Distribution and Status Cards */}
                        
                        {/* Summary Cards */}
                        <DistributorSummaryCards stock={distributorStock} />
                        {/* Individual Product Stock Cards */}
                        <div className="flex flex-wrap gap-6 justify-center mt-4 mb-8 w-full">
                            {productCards.map(product => (
                                <div key={product.name} className={`${product.color} border rounded-lg shadow px-8 py-4 flex flex-col items-center min-w-[180px] max-w-[220px]`}>
                                    <span className={`text-2xl font-bold ${product.text} mt-1`}>{product.value} {product.unit}</span>
                                </div>
                            ))}
                        </div>
                        {/* Available Orders (Retail Order History) */}
                        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Available Orders</h3>
                                <p className="mt-1 text-sm text-gray-500">All retail orders placed and available for processing</p>
                            </div>
                            <div className="px-4 py-5 sm:p-6">
                                <RetailOrderHistory />
                            </div>
                        </div>
                        {/* Current Stock Table */}
                        <div className="bg-white rounded shadow overflow-hidden border border-green-200 mb-8">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-green-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-900 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-900 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-900 uppercase tracking-wider">Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-green-200">
                                        {productCards.map(product => (
                                            <tr key={product.name}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.value}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.unit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <DistributorStockDistributionCard stock={distributorStock} />
                        <DistributorStockByStatusCard stock={distributorStock} />
                    </div>
                </>
            );
        }
        case 'customer':
            // Get order data from localStorage
            let customerOrders: any[] = [];
            if (typeof window !== 'undefined') {
                const savedOrders = localStorage.getItem('customerOrders');
                customerOrders = savedOrders ? JSON.parse(savedOrders) : [];
            }

            // Calculate order statistics
            let ordersWithDiscount = 0;
            let ordersWithoutDiscount = 0;
            let totalMoneySaved = 0;
            let totalSpent = 0;

            customerOrders.forEach((order: any) => {
                if (order.discountedAmount < order.total) {
                    ordersWithDiscount++;
                    totalMoneySaved += (order.total - order.discountedAmount);
                } else {
                    ordersWithoutDiscount++;
                }
                totalSpent += order.discountedAmount;
            });

            // Calculate average product order history
            const productTotals: { [key: string]: number } = {};
            const productOrderCounts: { [key: string]: number } = {};
            
            customerOrders.forEach((order: any) => {
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach((item: any) => {
                        if (item.name && item.quantity) {
                            productTotals[item.name] = (productTotals[item.name] || 0) + item.quantity;
                            productOrderCounts[item.name] = (productOrderCounts[item.name] || 0) + 1;
                        }
                    });
                }
            });
            
            const averageProductData = Object.entries(productTotals).map(([name, totalQuantity]) => {
                const orderCount = productOrderCounts[name] || 1;
                const averageQuantity = totalQuantity / orderCount;
                return {
                    name,
                    quantity: Math.round(averageQuantity * 100) / 100
                };
            });

            return (
                <div ref={reportRef} className="bg-blue-50 p-6 rounded shadow">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Customer Report</h2>
                            <p className="text-gray-600">Order history, preferences, and engagement reports</p>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                            <span>🖨️</span>
                            <span>Print Report</span>
                        </button>
                    </div>
                    <CustomerClassCard />
                    {/* Order Statistics Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Order Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded p-4 text-center border border-blue-200">
                                <div className="text-3xl font-bold text-green-600">{ordersWithDiscount}</div>
                                <div className="text-gray-700 mt-1">Orders with Discount</div>
                            </div>
                            <div className="bg-white rounded p-4 text-center border border-blue-200">
                                <div className="text-3xl font-bold text-blue-600">{ordersWithoutDiscount}</div>
                                <div className="text-gray-700 mt-1">Orders without Discount</div>
                            </div>
                            <div className="bg-white rounded p-4 text-center border border-blue-200">
                                <div className="text-3xl font-bold text-purple-600">Ugx {totalMoneySaved.toLocaleString()}</div>
                                <div className="text-gray-700 mt-1">Total Money Saved</div>
                            </div>
                            <div className="bg-white rounded p-4 text-center border border-blue-200">
                                <div className="text-3xl font-bold text-orange-600">Ugx {totalSpent.toLocaleString()}</div>
                                <div className="text-gray-700 mt-1">Total Amount Spent</div>
                            </div>
                        </div>
                    </div>

                    {/* General Orders Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">General Orders</h3>
                        {customerOrders.length > 0 ? (
                            <div className="bg-white rounded shadow overflow-hidden border border-blue-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-blue-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Order Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Products</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Total Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Amount Paid</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Discount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-blue-200">
                                            {customerOrders.map((order, index) => (
                                                <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(order.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div className="space-y-1">
                                                            {order.items && order.items.map((item: any, itemIndex: number) => (
                                                                <div key={itemIndex}>
                                                                    {item.name} x {item.quantity} @ Ugx {item.price?.toLocaleString()}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        Ugx {Number(order.total).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        Ugx {Number(order.discountedAmount).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {order.discountedAmount < order.total ? (
                                                            <span className="text-green-600 font-semibold">
                                                                -Ugx {(Number(order.total) - Number(order.discountedAmount)).toLocaleString()}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500">No discount</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <p className="text-lg">No orders found</p>
                                <p className="text-sm">Place some orders to see them here</p>
                            </div>
                        )}
                    </div>

                    {/* Average Product Order History Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Average Product Order History</h3>
                        {averageProductData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Bar Chart */}
                                <div className="bg-white rounded shadow p-4 border border-blue-200">
                                    <h4 className="text-lg font-semibold mb-2 text-gray-900">Average Quantity per Order</h4>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={averageProductData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value, name) => [`${value} units`, 'Average Quantity']} />
                                                <Legend />
                                                <Bar dataKey="quantity" fill="#3b82f6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                
                                {/* Table */}
                                <div className="bg-white rounded shadow p-4 border border-blue-200">
                                    <h4 className="text-lg font-semibold mb-2 text-gray-900">Product Averages</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-blue-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Product</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Average Quantity</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Total Orders</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-blue-200">
                                                {averageProductData.map((product, index) => (
                                                    <tr key={product.name} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{product.name}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{product.quantity} units</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{productOrderCounts[product.name] || 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <p className="text-lg">No order history found</p>
                                <p className="text-sm">Place some orders to see your analytics here</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        case 'factory-store': {
            // Get stock data from useStockStore
            const factoryStock = useStockStore((state) => state.stock);
            return (
                <>
                    <button
                        onClick={() => window.print()}
                        className="fixed top-4 right-4 z-50 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow print:hidden"
                    >
                        <span role="img" aria-label="print">🖨️</span>
                        <span>Print Preview</span>
                    </button>
                <div ref={reportRef} className="bg-purple-50 p-6 rounded shadow">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                    <h2 className="text-2xl font-bold mb-2">Factory Store Report</h2>
                            <p className="text-gray-600">Stock, packaging, and supply reports</p>
                        </div>
                    </div>
                    {/* Sales Summary Cards */}
                    <FactoryStoreSalesSummaryCards />
                    {/* Products Order History Card */}
                    <FactoryProductionOrderHistoryCardReport />
                    {/* Summary Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Stock Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded p-4 text-center border border-purple-200">
                                <div className="text-3xl font-bold text-purple-600">{factoryStock.length}</div>
                                <div className="text-gray-700 mt-1">Total Products</div>
                            </div>
                            <div className="bg-white rounded p-4 text-center border border-purple-200">
                                <div className="text-3xl font-bold text-purple-600">
                                    {factoryStock.reduce((total, item) => total + item.quantity, 0).toLocaleString()}
                                </div>
                                <div className="text-gray-700 mt-1">Total Units</div>
                            </div>
                            <div className="bg-white rounded p-4 text-center border border-purple-200">
                                <div className="text-3xl font-bold text-purple-600">
                                    {factoryStock.reduce((total, item) => {
                                        const packages = Math.floor(item.quantity / item.packageSize);
                                        const boxes = Math.floor(packages / item.boxSize);
                                        return total + boxes;
                                    }, 0).toLocaleString()}
                                </div>
                                <div className="text-gray-700 mt-1">Total Boxes</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Stock by Unit Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Stock by Unit</h3>
                        <div className="bg-white rounded shadow overflow-hidden border border-purple-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-purple-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">Quantity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">Unit</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-purple-200">
                                        {factoryStock.map((item, index) => (
                                            <tr key={item.name} className={index % 2 === 0 ? 'bg-white' : 'bg-purple-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unit}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        In Stock
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    {/* Stock by Box Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Stock by Box</h3>
                        <div className="bg-white rounded shadow overflow-hidden border border-purple-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-purple-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">Packages per Box</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">Total Packages</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">Total Boxes</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">Package Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-purple-200">
                                        {factoryStock.map((item, index) => {
                                            const currentPackages = Math.floor(item.quantity / item.packageSize);
                                            const currentBoxes = Math.floor(currentPackages / item.boxSize);
                                            return (
                                                <tr key={item.name} className={index % 2 === 0 ? 'bg-white' : 'bg-purple-50'}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.boxSize}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{currentPackages.toLocaleString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{currentBoxes.toLocaleString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.packageUnit}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    {/* Charts Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Stock Analytics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Stock by Unit Bar Chart */}
                            <div className="bg-white rounded shadow p-4 border border-purple-200">
                                <h4 className="text-lg font-semibold mb-2 text-gray-900">Stock by Unit</h4>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={factoryStock}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value, name, props) => [`${value} ${props.payload.unit}`, 'Quantity']} />
                                            <Legend />
                                            <Bar dataKey="quantity" fill="#8b5cf6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            {/* Stock by Box Bar Chart */}
                            <div className="bg-white rounded shadow p-4 border border-purple-200">
                                <h4 className="text-lg font-semibold mb-2 text-gray-900">Stock by Box</h4>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={factoryStock.map(item => {
                                            const currentPackages = Math.floor(item.quantity / item.packageSize);
                                            const currentBoxes = Math.floor(currentPackages / item.boxSize);
                                            return { name: item.name, boxes: currentBoxes };
                                        })}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`${value} boxes`, 'Boxes']} />
                                            <Legend />
                                            <Bar dataKey="boxes" fill="#10b981" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Package Distribution Pie Chart */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Package Distribution</h3>
                        <div className="bg-white rounded shadow p-4 border border-purple-200">
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie 
                                            data={factoryStock.map(item => {
                                                const currentPackages = Math.floor(item.quantity / item.packageSize);
                                                return { name: item.name, value: currentPackages };
                                            })} 
                                            dataKey="value" 
                                            nameKey="name" 
                                            cx="50%" 
                                            cy="50%" 
                                            outerRadius={120} 
                                            label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                        >
                                            <Cell fill="#8b5cf6" />
                                            <Cell fill="#10b981" />
                                            <Cell fill="#f59e0b" />
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [`${value} packages`, name]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    
                    {/* Stock Statistics */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Stock Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded shadow p-4 border border-purple-200">
                                <h4 className="text-lg font-semibold mb-4 text-gray-900">Product Details</h4>
                                <div className="space-y-4">
                                    {factoryStock.map((item) => {
                                        const currentPackages = Math.floor(item.quantity / item.packageSize);
                                        const currentBoxes = Math.floor(currentPackages / item.boxSize);
                                        return (
                                            <div key={item.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <span className="font-medium text-gray-900">{item.name}</span>
                                                    <p className="text-sm text-gray-500">{item.quantity.toLocaleString()} {item.unit}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-medium text-purple-600">{currentPackages} packages</span>
                                                    <p className="text-sm text-gray-500">{currentBoxes} boxes</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <div className="bg-white rounded shadow p-4 border border-purple-200">
                                <h4 className="text-lg font-semibold mb-4 text-gray-900">Summary Statistics</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                        <span className="font-medium text-gray-900">Total Products:</span>
                                        <strong className="text-xl text-purple-600">{factoryStock.length}</strong>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="font-medium text-gray-900">Total Units:</span>
                                        <strong className="text-xl text-green-600">{factoryStock.reduce((total, item) => total + item.quantity, 0).toLocaleString()}</strong>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="font-medium text-gray-900">Total Packages:</span>
                                        <strong className="text-xl text-blue-600">{factoryStock.reduce((total, item) => total + Math.floor(item.quantity / item.packageSize), 0).toLocaleString()}</strong>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                        <span className="font-medium text-gray-900">Total Boxes:</span>
                                        <strong className="text-xl text-orange-600">{factoryStock.reduce((total, item) => {
                                            const packages = Math.floor(item.quantity / item.packageSize);
                                            const boxes = Math.floor(packages / item.boxSize);
                                            return total + boxes;
                                        }, 0).toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Report Footer */}
                    <div className="bg-purple-50 border border-purple-200 rounded p-4">
                        <h4 className="font-semibold text-purple-900 mb-2">Report Information</h4>
                        <p className="text-purple-800 text-sm">
                            • <strong>Stock by Unit:</strong> Shows the total quantity of each product in their base units (litres, ml, g).<br/>
                            • <strong>Stock by Box:</strong> Displays how many packages and boxes are available for each product.<br/>
                            • <strong>Package Distribution:</strong> Visual representation of package distribution across all products.<br/>
                            • <strong>Data Source:</strong> Real-time data from the factory store inventory system.<br/>
                            • <strong>Report Generated:</strong> {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                </>
            );
        }
        case 'farmer': {
            // Farmer report: sync with dashboard cards
            const [harvestDataForm, setHarvestDataForm] = React.useState({
                farmName: '', harvestDate: '', weather: '', totalHarvestedArea: '', palmBatches: '', coconutBatches: '', harvestMethod: '', machines: '', transportMethod: '', timeSpent: '', numberOfWorkers: '', improvementSuggestions: '', generalComment: '',
            });
            const [farmSpecsForm, setFarmSpecsForm] = React.useState({
                farmSize: '', location: '', ownerName: '', soilType: '', numberOfTractors: '', numberOfTrailers: '', numberOfPalmOilTrees: '', numberOfCoconutTrees: '', areaOfPalmOilTrees: '', areaOfCoconutTrees: '',
            });
            const [editableHarvestData, setEditableHarvestData] = React.useState<any[]>([]);
            const [selectedMonthIdx, setSelectedMonthIdx] = React.useState(0);
            const [inventoryOrders, setInventoryOrders] = React.useState<any[]>([]);
            const [harvestHistory, setHarvestHistory] = React.useState<any[]>([]);
            React.useEffect(() => {
                if (typeof window !== 'undefined') {
                    const savedHarvest = localStorage.getItem('harvestDataForm');
                    if (savedHarvest) setHarvestDataForm(JSON.parse(savedHarvest));
                    const savedSpecs = localStorage.getItem('farmSpecsForm');
                    if (savedSpecs) setFarmSpecsForm(JSON.parse(savedSpecs));
                    const savedHarvestData = localStorage.getItem('editableHarvestData');
                    if (savedHarvestData) setEditableHarvestData(JSON.parse(savedHarvestData));
                    const savedOrders = localStorage.getItem('inventoryOrders');
                    if (savedOrders) setInventoryOrders(JSON.parse(savedOrders));
                    const savedHarvestHistory = localStorage.getItem('harvestHistory');
                    if (savedHarvestHistory) setHarvestHistory(JSON.parse(savedHarvestHistory));
                }
            }, []);
            const today = new Date().toISOString().split('T')[0];
            const ordersForToday = inventoryOrders.filter(order => order.deliveryDate === today);
            const ordersForTodayCount = ordersForToday.length;
            const lastSix = editableHarvestData.slice(-6);
            const avgCPO = lastSix.length > 0 ? Math.round(lastSix.reduce((sum: number, row: any) => sum + (row.crudePalmOil || 0), 0) / lastSix.length) : 0;
            const avgCoconutOil = lastSix.length > 0 ? Math.round(lastSix.reduce((sum: number, row: any) => sum + (row.coconutOil || 0), 0) / lastSix.length) : 0;
            return (
                <>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => window.print()}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow"
                        >
                            <span role="img" aria-label="print">🖨️</span>
                            <span>Print Preview</span>
                        </button>
                    </div>
                    <form>
                <div className="bg-orange-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Farmer Report</h2>
                    <p className="mb-6">Yield, harvest, and farm performance reports.</p>
                    {/* 4-card grid row inserted inside the report */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {/* Farm Size Card */}
                      <Card className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
                        <CardTitle className="text-lg font-bold mb-2">Farm Size</CardTitle>
                        <div className="text-2xl font-extrabold text-green-700">{farmSpecsForm.farmSize || 'N/A'}</div>
                        <div className="text-sm text-gray-500">Total area of the farm</div>
                      </Card>
                      {/* Area (Palm Oil) Card */}
                      <Card className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
                        <CardTitle className="text-lg font-bold mb-2">Area (Palm Oil)</CardTitle>
                        <div className="text-2xl font-extrabold text-yellow-700">{farmSpecsForm.areaOfPalmOilTrees || 'N/A'}</div>
                        <div className="text-sm text-gray-500">Area with palm oil trees</div>
                      </Card>
                      {/* Area (Coconut) Card */}
                      <Card className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
                        <CardTitle className="text-lg font-bold mb-2">Area (Coconut)</CardTitle>
                        <div className="text-2xl font-extrabold text-blue-700">{farmSpecsForm.areaOfCoconutTrees || 'N/A'}</div>
                        <div className="text-sm text-gray-500">Area with coconut trees</div>
                      </Card>
                      {/* Latest Harvest Card */}
                      <Card className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
                        <CardTitle className="text-lg font-bold mb-2">Latest Harvest</CardTitle>
                        {harvestHistory && harvestHistory.length > 0 ? (
                          <>
                            <div className="text-xl font-semibold text-gray-800">{harvestHistory[0].date || 'N/A'}</div>
                            <div className="text-sm text-green-700 mt-1">Palm Oil Fruits: <span className="font-bold">{harvestHistory[0].palmBatches || 0}</span></div>
                            <div className="text-sm text-blue-700">Coconut: <span className="font-bold">{harvestHistory[0].coconutBatches || 0}</span></div>
                          </>
                        ) : (
                          <div className="text-gray-500">No harvests yet</div>
                        )}
                      </Card>
                    </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-emerald-100 h-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xl font-bold text-green-800">Today's Raw Material<br/>needed Deliveries</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-green-600">{ordersForTodayCount}</div>
                                        <p className="text-sm text-gray-500 mt-2">Inventory raw material orders to be delivered today</p>
                                    </CardContent>
                                </Card>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 h-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xl font-bold text-amber-800">Average Monthly Palm Oil Production</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-amber-600">{avgCPO} litres</div>
                                        <p className="text-sm text-gray-500 mt-2">Average monthly production (litres)</p>
                                    </CardContent>
                                </Card>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50 h-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xl font-bold text-purple-800">Average Monthly Coconut Oil</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-purple-600">{avgCoconutOil} litres</div>
                                        <p className="text-sm text-gray-500 mt-2">Average monthly production (litres)</p>
                                    </CardContent>
                                </Card>
                </div>
                            <div className="mb-8">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Monthly Production (litres)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={lastSix}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis label={{ value: 'Monthly Production (litres)', angle: -90, position: 'insideLeft' }} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="coconutOil" fill="#4CAF50" name="Coconut Oil" />
                                                <Bar dataKey="crudePalmOil" fill="#2196F3" name="Crude Palm Oil" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                </div>
                            <div className="mb-8">
                                <Card className="w-full">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold text-blue-900">Harvest Data</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form className="space-y-4 w-full max-w-2xl mx-auto">
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Farm Name</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.farmName} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Harvest Date</label>
                                                <input type="date" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.harvestDate} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Weather at Harvest</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.weather} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Total Harvested Area</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.totalHarvestedArea} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Number of Batches Harvested (Palm Oil)</label>
                                                <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.palmBatches} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Number of Batches Harvested (Coconut)</label>
                                                <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.coconutBatches} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Harvest Method</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.harvestMethod} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Machines (if any)</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.machines} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Transport Method</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.transportMethod} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Time Spent</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.timeSpent} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Number of Workers</label>
                                                <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.numberOfWorkers} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Improvement Suggestions</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.improvementSuggestions} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Harvest General Comment</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={harvestDataForm.generalComment} disabled />
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="mb-8">
                                <Card className="w-full">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold text-green-900">Farm Specs</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form className="space-y-4 w-full max-w-2xl mx-auto">
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Farm Size</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.farmSize} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Location</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.location} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Owner Name</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.ownerName} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Soil Type</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.soilType} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Number of Tractors</label>
                                                <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.numberOfTractors} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Number of Trailers</label>
                                                <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.numberOfTrailers} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Number of Palm Oil Trees</label>
                                                <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.numberOfPalmOilTrees} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Number of Coconut Trees</label>
                                                <input type="number" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.numberOfCoconutTrees} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Area of Palm Oil Trees</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.areaOfPalmOilTrees} disabled />
                                            </div>
                                            <div className="flex items-center w-full justify-between">
                                                <label className="font-medium text-gray-700 w-auto text-left">Area of Coconut Trees</label>
                                                <input type="text" className="border rounded p-2 w-auto flex-1 ml-4 text-right" value={farmSpecsForm.areaOfCoconutTrees} disabled />
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="mb-8">
                                <Card className="w-full">
                                    <CardHeader>
                                        <CardTitle>Inventory Raw Material Order</CardTitle>
                                        <CardDescription>Orders placed for raw materials from farms</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {inventoryOrders.length === 0 ? (
                                                <div className="text-center py-8 text-gray-500">
                                                    No farm orders placed yet.
                                                </div>
                                            ) : (
                                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                                    {inventoryOrders
                                                        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                        .map((order: any) => (
                                                            <div key={order.id} className="p-4 bg-gray-50 rounded-lg border">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-800">
                                                                            Farm Order #{order.id.slice(-6)}
                                                                        </h4>
                                                                        <p className="text-sm text-gray-600">
                                                                            {new Date(order.timestamp).toLocaleDateString()} at {new Date(order.timestamp).toLocaleTimeString()}
                                                                        </p>
                                                                        {order.deliveryDate && (
                                                                            <p className="text-sm text-blue-600">
                                                                                Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                                        {order.status}
                                                                    </span>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="text-sm">
                                                                        <span className="font-medium text-gray-700">Palm Oil:</span>
                                                                        <span className="ml-2 text-blue-600 font-semibold">
                                                                            {order.palmOilQuantity}L
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-sm">
                                                                        <span className="font-medium text-gray-700">Coconut Oil:</span>
                                                                        <span className="ml-2 text-blue-600 font-semibold">
                                                                            {order.coconutOilQuantity}L
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </>
            );
        }
        case 'unofficial-vendor':
            // Get vendor data from localStorage
            let vendorAcceptedVendors: string[] = [];
            let vendorRejectedVendors: string[] = [];
            let vendorAcceptedVendorDates: { [username: string]: string } = {};
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('acceptedVendors');
                vendorAcceptedVendors = saved ? JSON.parse(saved) : [];
                const savedRejected = localStorage.getItem('rejectedVendors');
                vendorRejectedVendors = savedRejected ? JSON.parse(savedRejected) : [];
                const savedDates = localStorage.getItem('acceptedVendorDates');
                vendorAcceptedVendorDates = savedDates ? JSON.parse(savedDates) : {};
            }
            
            return (
                <div className="bg-blue-50 border-2 border-purple-600 p-6 rounded-xl shadow">
                    <h2 className="text-2xl font-bold text-black-900 mb-6">Vendor Application Status Report</h2>
                    
                    {/* Summary Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-black-900 mb-4">Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white rounded p-4 text-center border border-purple-200">
                                <div className="text-3xl font-bold text-purple-600">{vendorAcceptedVendors.length}</div>
                                <div className="text-gray-700 mt-1">Accepted Applications</div>
                            </div>
                            <div className="bg-white rounded p-4 text-center border border-purple-200">
                                <div className="text-3xl font-bold text-purple-600">{vendorRejectedVendors.length}</div>
                                <div className="text-gray-700 mt-1">Rejected Applications</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Accepted Vendors Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-black-900 mb-4">Accepted Applications</h3>
                        {vendorAcceptedVendors.length > 0 ? (
                            <div className="bg-white rounded p-4 border border-purple-200">
                                <ul className="list-disc list-inside">
                                    {vendorAcceptedVendors.map((name) => (
                                        <li key={name} className="mb-2 text-black-900">
                                            <span className="font-semibold">{name}</span>
                                            {vendorAcceptedVendorDates[name] && (
                                                <span className="ml-2 text-purple-900 text-sm font-bold">(Visit Date: {vendorAcceptedVendorDates[name]} 10:10am)</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="text-gray-500 bg-white rounded p-4 border border-purple-200">No accepted vendors yet.</div>
                        )}
                    </div>
                    
                    {/* Rejected Vendors Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-black-900 mb-4">Rejected Applications</h3>
                        {vendorRejectedVendors.length > 0 ? (
                            <div className="bg-white rounded p-4 border border-purple-200">
                                <ul className="list-disc list-inside">
                                    {vendorRejectedVendors.map((name) => (
                                        <li key={name} className="mb-2 text-black-900">
                                            <span className="font-semibold">{name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="text-gray-500 bg-white rounded p-4 border border-purple-200">No rejected vendors yet.</div>
                        )}
                    </div>
                    
                    {/* Pie Chart Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-black-900 mb-4">Application Status Distribution</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded shadow p-4 border border-purple-200">
                                <h4 className="text-lg font-semibold mb-2 text-black-900">Accepted vs Rejected Applications</h4>
                                <div className="flex items-center justify-center gap-6 mb-4">
                                    <span className="text-xl font-bold text-green-600">Accepted: {vendorAcceptedVendors.length > 0 || vendorRejectedVendors.length > 0 ? `${((vendorAcceptedVendors.length / (vendorAcceptedVendors.length + vendorRejectedVendors.length)) * 100).toFixed(1)}%` : 'N/A'}</span>
                                    <span className="text-xl font-bold text-red-600">Rejected: {vendorAcceptedVendors.length > 0 || vendorRejectedVendors.length > 0 ? `${((vendorRejectedVendors.length / (vendorAcceptedVendors.length + vendorRejectedVendors.length)) * 100).toFixed(1)}%` : 'N/A'}</span>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie 
                                                data={[
                                                    { name: 'Accepted', value: vendorAcceptedVendors.length },
                                                    { name: 'Rejected', value: vendorRejectedVendors.length }
                                                ]} 
                                                dataKey="value" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="50%" 
                                                outerRadius={100} 
                                                label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                            >
                                                <Cell fill="#10b981" /> {/* Green for accepted */}
                                                <Cell fill="#ef4444" /> {/* Red for rejected */}
                                            </Pie>
                                            <Tooltip formatter={(value, name) => [`${value} applications`, name]} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            {/* Statistics Card */}
                            <div className="bg-white rounded shadow p-4 border border-purple-200">
                                <h4 className="text-lg font-semibold mb-4 text-black-900">Application Statistics</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-black-900">Total Applications:</span>
                                        <strong className="text-xl text-purple-600">{vendorAcceptedVendors.length + vendorRejectedVendors.length}</strong>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="font-medium text-black-900">Accepted Rate:</span>
                                        <strong className="text-xl text-green-600">{vendorAcceptedVendors.length > 0 || vendorRejectedVendors.length > 0 ? `${((vendorAcceptedVendors.length / (vendorAcceptedVendors.length + vendorRejectedVendors.length)) * 100).toFixed(1)}%` : '0%'}</strong>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <span className="font-medium text-black-900">Rejection Rate:</span>
                                        <strong className="text-xl text-red-600">{vendorAcceptedVendors.length > 0 || vendorRejectedVendors.length > 0 ? `${((vendorRejectedVendors.length / (vendorAcceptedVendors.length + vendorRejectedVendors.length)) * 100).toFixed(1)}%` : '0%'}</strong>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="font-medium text-black-900">Processing Status:</span>
                                        <strong className="text-xl text-blue-600">{(vendorAcceptedVendors.length + vendorRejectedVendors.length) > 0 ? 'Complete' : 'No Data'}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Application Status Note */}
                    <div className="bg-purple-50 border border-purple-200 rounded p-4">
                        <h4 className="font-semibold text-purple-900 mb-2">Application Status Information</h4>
                        <p className="text-purple-800 text-sm">
                            • <strong>Accepted Applications:</strong> Vendors who have been approved and are required to visit the company on their allocated date.<br/>
                            • <strong>Rejected Applications:</strong> Applications that did not meet the required criteria or had incomplete information.<br/>
                            • <strong>Data Source:</strong> Real-time data from the vendor application system.
                        </p>
                    </div>
                </div>
            );
        case 'inventory-manager': {
            // State and logic for report (mirroring dashboard)
            const [palmOilStock, setPalmOilStock] = React.useState(() => {
                if (typeof window !== 'undefined') {
                    const saved = localStorage.getItem('palmOilStock');
                    return saved ? parseInt(saved) || 150 : 150;
                }
                return 150;
            });
            const [coconutOilStock, setCoconutOilStock] = React.useState(() => {
                if (typeof window !== 'undefined') {
                    const saved = localStorage.getItem('coconutOilStock');
                    return saved ? parseInt(saved) || 80 : 80;
                }
                return 80;
            });
            const [inventoryOrders, setInventoryOrders] = React.useState(() => {
                if (typeof window !== 'undefined') {
                    const saved = localStorage.getItem('inventoryOrders');
                    return saved ? JSON.parse(saved) : [];
                }
                return [];
            });
            const thresholds = { palmOil: 200, coconutOil: 100 };
            const expectedDeliveries = (() => {
                const today = new Date().toISOString().split('T')[0];
                const todaysOrders = inventoryOrders.filter((order: any) => order.deliveryDate === today);
                const totalPalmOilExpected = todaysOrders.reduce((sum: number, order: any) => sum + order.palmOilQuantity, 0);
                const totalCoconutOilExpected = todaysOrders.reduce((sum: number, order: any) => sum + order.coconutOilQuantity, 0);
                return {
                    palmOil: totalPalmOilExpected,
                    coconutOil: totalCoconutOilExpected,
                    total: totalPalmOilExpected + totalCoconutOilExpected
                };
            })();
            const criticalItems = [
                {
                    id: 1,
                    name: 'Palm Oil',
                    current: palmOilStock,
                    threshold: thresholds.palmOil,
                    isCritical: palmOilStock < thresholds.palmOil,
                    status: palmOilStock === 0 ? 'Out of Stock' : palmOilStock < thresholds.palmOil ? 'Low Stock' : 'Adequate Stock'
                },
                {
                    id: 2,
                    name: 'Coconut Oil',
                    current: coconutOilStock,
                    threshold: thresholds.coconutOil,
                    isCritical: coconutOilStock < thresholds.coconutOil,
                    status: coconutOilStock === 0 ? 'Out of Stock' : coconutOilStock < thresholds.coconutOil ? 'Low Stock' : 'Adequate Stock'
                }
            ];
            const allInventoryItems = criticalItems;
            const updatedOilTypesData = [
                { name: 'Palm Oil', value: Math.round((palmOilStock / (palmOilStock + coconutOilStock)) * 100) || 0 },
                { name: 'Coconut Oil', value: Math.round((coconutOilStock / (palmOilStock + coconutOilStock)) * 100) || 0 },
            ];
            return (
                <>
                    <button
                        onClick={() => window.print()}
                        className="fixed top-4 right-4 z-50 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow print:hidden"
                    >
                        <span role="img" aria-label="print">🖨️</span>
                        <span>Print Preview</span>
                    </button>
                    <div className="bg-teal-50 p-6 rounded shadow">
                        <h2 className="text-4xl font-extrabold text-center mb-2 text-teal-800">Inventory Manager Report</h2>
                        <p className="text-lg text-gray-600 text-center mb-6">Overview of inventory operations, stock levels, and management activities.</p>
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                                <div className="text-sm font-medium text-gray-500">Total Stock</div>
                                <div className="text-2xl font-bold mt-1">{palmOilStock + coconutOilStock} L</div>
                            </div>
                            <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                                <div className="text-sm font-medium text-gray-500">Palm Oil Stock</div>
                                <div className="text-2xl font-bold mt-1">{palmOilStock} L</div>
                                <div className={`text-sm mt-1 ${palmOilStock < thresholds.palmOil ? 'text-yellow-600' : 'text-green-600'}`}>{palmOilStock < thresholds.palmOil ? 'Low Stock' : 'Adequate Stock'}</div>
                            </div>
                            <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                                <div className="text-sm font-medium text-gray-500">Coconut Oil Stock</div>
                                <div className="text-2xl font-bold mt-1">{coconutOilStock} L</div>
                                <div className={`text-sm mt-1 ${coconutOilStock < thresholds.coconutOil ? 'text-red-600' : 'text-green-600'}`}>{coconutOilStock < thresholds.coconutOil ? 'Low Stock' : 'Adequate Stock'}</div>
                            </div>
                            <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                                <div className="text-sm font-medium text-gray-500">Expected Deliveries</div>
                                <div className="text-2xl font-bold mt-1">{expectedDeliveries.total} L</div>
                            </div>
                        </div>
                        {/* Raw Material Order History */}
                        <div className="mb-8">
                            <div className="bg-white rounded shadow p-6">
                                <div className="text-xl font-semibold mb-2">Raw Material Order History</div>
                                <div className="text-gray-600 mb-4">History of raw material orders from manufacturers</div>
                                <div className="space-y-4">
                                    {(() => {
                                        const rawMaterialOrders = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('rawMaterialOrders') || '[]') : [];
                                        if (rawMaterialOrders.length === 0) {
                                            return (
                                                <div className="text-center py-8 text-gray-500">
                                                    No raw material orders found.
                                                </div>
                                            );
                                        }
                                        const groupedOrders = rawMaterialOrders.reduce((groups: any, order: any) => {
                                            const timestamp = order.timestamp;
                                            if (!groups[timestamp]) {
                                                groups[timestamp] = {
                                                    timestamp: timestamp,
                                                    date: order.date,
                                                    orders: [],
                                                    totalPalmOil: 0,
                                                    totalCoconutOil: 0
                                                };
                                            }
                                            groups[timestamp].orders.push(order);
                                            groups[timestamp].totalPalmOil += order.totalPalmOil;
                                            groups[timestamp].totalCoconutOil += order.totalCoconutOil;
                                            return groups;
                                        }, {});
                                        const sortedGroups = Object.values(groupedOrders)
                                            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                                        return (
                                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                                {sortedGroups.map((group: any, index: number) => (
                                                    <div key={group.timestamp} className="p-4 bg-gray-50 rounded-lg border">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <div className="font-medium text-gray-800">
                                                                    Order #{index + 1}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {new Date(group.timestamp).toLocaleDateString()} at {new Date(group.timestamp).toLocaleTimeString()}
                                                                </div>
                                                                {group.orders.length > 1 && (
                                                                    <div className="text-xs text-blue-600 mt-1">
                                                                        {group.orders.length} items ordered
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                                Placed
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="text-sm">
                                                                <span className="font-medium text-gray-700">Palm Oil:</span>
                                                                <span className="ml-2 text-blue-600 font-semibold">
                                                                    {group.totalPalmOil}L
                                                                </span>
                                                            </div>
                                                            <div className="text-sm">
                                                                <span className="font-medium text-gray-700">Coconut Oil:</span>
                                                                <span className="ml-2 text-blue-600 font-semibold">
                                                                    {group.totalCoconutOil}L
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>                   {/* Inventory Raw Material Order */}
                        <div className="mb-8">
                            <div className="bg-white rounded shadow p-6">
                                <div className="text-xl font-semibold mb-2">Inventory Raw Material Order</div>
                                <div className="text-gray-600 mb-4">Orders placed for raw materials from farms</div>
                                <div className="space-y-4">
                                    {inventoryOrders.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No farm orders placed yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {inventoryOrders
                                                .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                .map((order: any) => (
                                                    <div key={order.id} className="p-4 bg-gray-50 rounded-lg border">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <div className="font-medium text-gray-800">
                                                                    Farm Order #{order.id.slice(-6)}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {new Date(order.timestamp).toLocaleDateString()} at {new Date(order.timestamp).toLocaleTimeString()}
                                                                </div>
                                                                {order.deliveryDate && (
                                                                    <div className="text-sm text-blue-600">
                                                                        Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="text-sm">
                                                                <span className="font-medium text-gray-700">Palm Oil:</span>
                                                                <span className="ml-2 text-blue-600 font-semibold">
                                                                    {order.palmOilQuantity}L
                                                                </span>
                                                            </div>
                                                            <div className="text-sm">
                                                                <span className="font-medium text-gray-700">Coconut Oil:</span>
                                                                <span className="ml-2 text-blue-600 font-semibold">
                                                                    {order.coconutOilQuantity}L
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* 2x2 Grid for Inventory Status and Available Raw Materials */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded shadow p-6">
                                <div className="text-xl font-semibold mb-2">Inventory Status</div>
                                <div className="text-gray-600 mb-4">Current stock levels and status</div>
                                <div className="space-y-4">
                                    {allInventoryItems.map((item) => {
                                        const getBackgroundColor = () => {
                                            if (item.status === 'Out of Stock') return 'bg-red-50 border border-red-200';
                                            if (item.status === 'Low Stock') return 'bg-yellow-50 border border-yellow-200';
                                            return 'bg-green-50 border border-green-200';
                                        };
                                        const getStatusColor = () => {
                                            if (item.status === 'Out of Stock') return 'text-red-600';
                                            if (item.status === 'Low Stock') return 'text-yellow-600';
                                            return 'text-green-600';
                                        };
                                        return (
                                            <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${getBackgroundColor()}`}>
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Current: {item.current}L | Threshold: {item.threshold}L
                                                    </p>
                                                    <p className={`text-xs mt-1 font-semibold ${getStatusColor()}`}>
                                                        Status: {item.status}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
        default:
            return (
                <div className="bg-gray-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">General Report</h2>
                    <p>General report content. Log in as a specific user to see a tailored report.</p>
                    <p className="mt-4 text-sm text-gray-600">Dashboard: {dashboard}</p>
                </div>
            );
    }
}

// Add AvailableRetailStockBarGraph component for retail report
function AvailableRetailStockBarGraph() {
  const [stockData, setStockData] = React.useState([
    { name: 'Cooking Oil', stock: 0 },
    { name: 'Shampoo', stock: 0 },
    { name: 'Soft Margarine', stock: 0 },
  ]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('retailStock');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setStockData(parsed.map((p: any) => ({ name: p.name, stock: p.stock })));
          }
        } catch {}
      }
    }
  }, []);

  return (
    <div className="bg-white rounded shadow p-6 border border-green-200 mb-8 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-green-800">Available Retail Stock</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="stock" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Add ProductStockStatusTable, RetailOrderHistory, and AvailableCustomerOrdersCard components for the retail report
function ProductStockStatusTable({ stock }: { stock: any[] }) {
  const getStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-600 text-white' };
    if (stock <= threshold) return { label: 'Low Stock', color: 'bg-yellow-500 text-white' };
    return { label: 'In Stock', color: 'bg-green-600 text-white' };
  };
  // Use default thresholds if not present
  const thresholds: Record<string, number> = {
    'Cooking Oil': 20,
    'Shampoo': 30,
    'Soft Margarine': 40,
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-8 py-6 shadow w-full max-w-3xl mb-8 mx-auto">
      <span className="text-lg font-semibold text-gray-700 mb-4 block">Product Stock Status</span>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stock.map(product => {
              const status = getStatus(product.stock, product.threshold ?? thresholds[product.name] ?? 0);
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RetailDailyWeeklySalesCards() {
  const [daily, setDaily] = React.useState(0);
  const [weekly, setWeekly] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('customerOrders');
      if (stored) {
        try {
          const orders = JSON.parse(stored);
          if (Array.isArray(orders)) {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // Sunday=0, so treat as 7
            const monday = new Date(now);
            monday.setDate(now.getDate() - (dayOfWeek - 1));
            monday.setHours(0, 0, 0, 0);
            const weekEnd = new Date(now);
            // Daily sales: sum discountedAmount for today
            const dailySales = orders
              .filter((order: any) => order.date && order.date.startsWith(today))
              .reduce((sum: number, order: any) => sum + (order.discountedAmount || 0), 0);
            // Weekly sales: sum discountedAmount from Monday to today
            const weeklySales = orders
              .filter((order: any) => {
                if (!order.date) return false;
                const orderDate = new Date(order.date);
                return orderDate >= monday && orderDate <= weekEnd;
              })
              .reduce((sum: number, order: any) => sum + (order.discountedAmount || 0), 0);
            setDaily(dailySales);
            setWeekly(weeklySales);
          }
        } catch {}
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex items-center">
          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m8-10h2M2 12H4m15.364-7.364l1.414 1.414M4.222 19.778l1.414-1.414M19.778 19.778l-1.414-1.414M4.222 4.222l1.414 1.414" /></svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Daily Sales</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">Ugx {daily.toLocaleString()}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m8-10h2M2 12H4m15.364-7.364l1.414 1.414M4.222 19.778l1.414-1.414M19.778 19.778l-1.414-1.414M4.222 4.222l1.414 1.414" /></svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Weekly Sales</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">Ugx {weekly.toLocaleString()}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function RetailOrderHistory() {
  const [orders, setOrders] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('retailOrders');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOrders(Array.isArray(parsed) ? parsed : []);
        } catch {
          setOrders([]);
        }
      }
    }
  }, []);
  return (
    <div className="px-8 py-6 flex flex-col items-center w-full mb-8 relative">
      <span className="text-lg font-semibold text-gray-700 mb-4">Retail Order History</span>
      {orders.length === 0 ? (
        <div className="text-gray-500">No retail orders found.</div>
      ) : (
        <div className="w-full space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border-b pb-4">
              <div className="flex justify-between font-semibold">
                <span>Order Date:</span>
                <span>{new Date(order.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Original Total:</span>
                <span>Ugx {Number(order.originalTotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discounted Total:</span>
                <span>Ugx {Number(order.discountedTotal).toLocaleString()}</span>
              </div>
              {order.discountedTotal < order.originalTotal && (
                <div className="flex justify-end text-green-600 font-medium">25% discount applied for products with quantity &gt; 1</div>
              )}
              <div className="mt-2">
                <div className="font-semibold">Products:</div>
                <ul className="list-disc list-inside">
                  {order.items && order.items.map((item: any) => (
                    <li key={item.id}>
                      {item.name} x {item.quantity} @ Ugx {item.price.toLocaleString()}
                      {item.discountApplied && (
                        <span className="ml-2 text-green-600">(25% discount)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex flex-row gap-2 justify-end items-center">
                {['placed', 'received', 'completed'].map(statusKey => (
                  <span
                    key={statusKey}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors
                      ${order.status === statusKey
                        ? statusKey === 'placed' ? 'bg-blue-600 text-white border-blue-600' :
                          statusKey === 'received' ? 'bg-yellow-500 text-white border-yellow-500' :
                          'bg-green-600 text-white border-green-600'
                        : statusKey === 'placed' ? 'text-blue-600 border-blue-600' :
                          statusKey === 'received' ? 'text-yellow-600 border-yellow-500' :
                          'text-green-600 border-green-600'
                    }`}
                  >
                    {statusKey === 'placed' ? 'Placed' : statusKey === 'received' ? 'Received' : 'Order Completed'}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AvailableCustomerOrdersCard() {
  const [orders, setOrders] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('customerOrders');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOrders(Array.isArray(parsed) ? parsed : []);
        } catch {
          setOrders([]);
        }
      }
    }
  }, []);
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6 w-full max-w-5xl mx-auto mb-8">
      <h3 className="mb-4 text-lg font-medium text-gray-900">Available Customer Orders</h3>
      <div className="text-3xl font-bold text-yellow-700 text-center mb-4">{orders.length}</div>
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-yellow-200">
            <thead className="bg-yellow-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-yellow-900 uppercase tracking-wider">Order Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-yellow-900 uppercase tracking-wider">Products</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-yellow-900 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-yellow-100">
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <ul className="list-disc list-inside">
                      {order.items && order.items.map((item: any, idx: number) => (
                        <li key={idx}>{item.name} x {item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">Ugx {order.total ? Number(order.total).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">No customer orders found</div>
      )}
    </div>
  );
}

function DistributorSummaryCards({ stock }: { stock: { cookingOil: number, shampoo: number, margarine: number } }) {
  // Calculate daily, weekly, monthly sales from retailOrders
  const [daily, setDaily] = React.useState(0);
  const [weekly, setWeekly] = React.useState(0);
  const [critical, setCritical] = React.useState(0);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('retailOrders');
      if (stored) {
        try {
          const orders = JSON.parse(stored);
          if (Array.isArray(orders)) {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
            const monday = new Date(now);
            monday.setDate(now.getDate() - (dayOfWeek - 1));
            monday.setHours(0, 0, 0, 0);
            const weekEnd = new Date(now);
            const dailySales = orders
              .filter((order: any) => order.date && order.date.startsWith(today))
              .reduce((sum: number, order: any) => sum + (order.discountedTotal || 0), 0);
            const weeklySales = orders
              .filter((order: any) => {
                if (!order.date) return false;
                const orderDate = new Date(order.date);
                return orderDate >= monday && orderDate <= weekEnd;
              })
              .reduce((sum: number, order: any) => sum + (order.discountedTotal || 0), 0);
            setDaily(dailySales);
            setWeekly(weeklySales);
          }
        } catch {}
      }
    }
    // Calculate critical stock and total packs
    const values = [stock.cookingOil, stock.shampoo, stock.margarine];
    setCritical(values.filter(v => v > 0 && v <= 400).length);
    setTotal(values.reduce((a, b) => a + b, 0));
  }, [stock]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex items-center">
          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m8-10h2M2 12H4m15.364-7.364l1.414 1.414M4.222 19.778l1.414-1.414M19.778 19.778l-1.414-1.414M4.222 4.222l1.414 1.414" /></svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Daily Sales</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">Ugx {daily.toLocaleString()}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m8-10h2M2 12H4m15.364-7.364l1.414 1.414M4.222 19.778l1.414-1.414M19.778 19.778l-1.414-1.414M4.222 4.222l1.414 1.414" /></svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Weekly Sales</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">Ugx {weekly.toLocaleString()}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex items-center">
          <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" /></svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Critical Stock</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{critical}</div>
                <span className="ml-2 text-sm text-gray-500">products running low</span>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg px-8 py-4 flex flex-col items-center shadow">
        <span className="text-lg font-semibold text-gray-700 mb-1">Total</span>
        <span className="text-3xl font-bold text-green-700 mb-1">{total}</span>
        <span className="text-lg font-semibold text-gray-700">packs</span>
      </div>
    </div>
  );
}

function FactoryStoreSalesSummaryCards() {
  const [daily, setDaily] = React.useState(0);
  const [weekly, setWeekly] = React.useState(0);
  const [totalOrders, setTotalOrders] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('distributorOrders');
      if (stored) {
        try {
          const orders = JSON.parse(stored);
          if (Array.isArray(orders)) {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
            const monday = new Date(now);
            monday.setDate(now.getDate() - (dayOfWeek - 1));
            monday.setHours(0, 0, 0, 0);
            const weekEnd = new Date(now);
            // Daily sales: sum discountedTotal for today
            const dailySales = orders
              .filter((order: any) => order.date && order.date.startsWith(today))
              .reduce((sum: number, order: any) => sum + (order.discountedTotal || 0), 0);
            // Weekly sales: sum discountedTotal from Monday to today
            const weeklySales = orders
              .filter((order: any) => {
                if (!order.date) return false;
                const orderDate = new Date(order.date);
                return orderDate >= monday && orderDate <= weekEnd;
              })
              .reduce((sum: number, order: any) => sum + (order.discountedTotal || 0), 0);
            setDaily(dailySales);
            setWeekly(weeklySales);
            setTotalOrders(orders.length);
          }
        } catch {}
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex items-center">
          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m8-10h2M2 12H4m15.364-7.364l1.414 1.414M4.222 19.778l1.414-1.414M19.778 19.778l-1.414-1.414M4.222 4.222l1.414 1.414" /></svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Daily Sales</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">Ugx {daily.toLocaleString()}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m8-10h2M2 12H4m15.364-7.364l1.414 1.414M4.222 19.778l1.414-1.414M19.778 19.778l-1.414-1.414M4.222 4.222l1.414 1.414" /></svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Weekly Sales</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">Ugx {weekly.toLocaleString()}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex items-center">
          <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" /></svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{totalOrders}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this component at the top-level (before getDashboardReport):
function CustomerClassCard() {
    const [customerClass, setCustomerClass] = React.useState('Bronze');
    React.useEffect(() => {
        function calculate() {
            if (typeof window !== 'undefined') {
                const savedOrders = localStorage.getItem('customerOrders');
                if (savedOrders) {
                    const orders = JSON.parse(savedOrders);
                    if (orders.length > 0) {
                        const total = orders.reduce((sum: number, order: any) => sum + (order.discountedAmount || 0), 0);
                        const avg = total / orders.length;
                        if (avg < 75000) setCustomerClass('Bronze');
                        else if (avg < 195000) setCustomerClass('Silver');
                        else setCustomerClass('Gold');
                        return;
                    }
                }
            }
            setCustomerClass('Bronze');
        }
        calculate();
        const handleStorage = () => calculate();
        window.addEventListener('storage', handleStorage);
        window.addEventListener('localStorageChange', handleStorage);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('localStorageChange', handleStorage);
        };
    }, []);
    return (
        <div className="mb-6 flex items-center justify-center">
            <span className={`px-4 py-2 rounded-full font-bold text-white text-lg ${customerClass === 'Gold' ? 'bg-yellow-500' : customerClass === 'Silver' ? 'bg-gray-400' : 'bg-orange-700'}`}>Current Customer Class: {customerClass}</span>
        </div>
    );
}

export default function Report() {
    const { dashboard: dashboardProp } = usePage().props as { dashboard?: string };
    const dashboard = dashboardProp || '';
    // For print preview and PDF
    const reportRef = useRef<HTMLDivElement>(null);
    
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
    return (
        <AppLayout>
            <div>
                <Head title="Report" />
                <div className="container mx-auto px-4 py-8 relative">
                    {/* Buttons in upper right, outside report */}
                    {(dashboard === 'admin' || dashboard === 'unofficial-vendor') && (
                        <div className="absolute right-6 top-0 flex gap-4 z-10 print:hidden">
                            <button onClick={handlePrint} className="px-6 py-2 rounded bg-green-700 text-white font-semibold hover:bg-green-700 transition-colors">Print Report</button>
                        </div>
                    )}
                    {/* Pass ref to report content for print */}
                    <div ref={(dashboard === 'admin' || dashboard === 'unofficial-vendor') ? reportRef : undefined}>
                        {/* Removed the 'Report kdj' heading */}
                        {getDashboardReport(dashboard)}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 

// Add this component at the bottom of the file:
function FactoryProductionOrderHistoryCardReport() {
  const [orders, setOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('factoryProductionOrders');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOrders(Array.isArray(parsed) ? parsed.reverse() : []);
        } catch {
          setOrders([]);
        }
      }
    }
  }, []);

  if (orders.length === 0) {
    return <div className="bg-white shadow rounded-lg p-8 text-gray-500">No production orders found.</div>;
  }
  return (
    <div className="bg-white shadow rounded-lg p-8 mb-8">
      <h2 className="text-xl font-bold mb-4">Products Order History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(order.date).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <ul className="list-disc list-inside">
                    {order.items && order.items.map((item: any, idx: number) => (
                      <li key={idx}>{item.name} x {item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Needed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
} 