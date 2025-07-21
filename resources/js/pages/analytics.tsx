import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useStockStore from '@/store/useStockStore';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

type ProductionEntry = {
  date: string;
  'Cooking Oil': number;
  Shampoo: number;
  Margarine: number;
};

// Initial production data
const initialProductionData: ProductionEntry[] = [
    { date: '2025-07-01', 'Cooking Oil': 400, Shampoo: 240, Margarine: 300 },
    { date: '2025-07-02', 'Cooking Oil': 300, Shampoo: 139, Margarine: 450 },
    { date: '2025-07-03', 'Cooking Oil': 200, Shampoo: 240, Margarine: 200 },
    { date: '2025-07-04', 'Cooking Oil': 278, Shampoo: 390, Margarine: 350 },
    { date: '2025-07-05', 'Cooking Oil': 189, Shampoo: 480, Margarine: 250 },
    { date: '2025-07-06', 'Cooking Oil': 239, Shampoo: 380, Margarine: 280 },
    { date: '2025-07-07', 'Cooking Oil': 349, Shampoo: 430, Margarine: 210 },
];

function AddProductionDataCard() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [cookingOilUnits, setCookingOilUnits] = useState('');
    const [shampooUnits, setShampooUnits] = useState('');
    const [margarineUnits, setMargarineUnits] = useState('');

    // Product package sizes (same as manufacturer dashboard)
    const productPackageSizes = {
        'Cooking Oil': 500, // 500ml per jerrican
        'Shampoo': 200,     // 200ml per tube
        'Margarine': 400,   // 400g per container
    };

    // Wrap getExistingData in useCallback
    const getExistingData = useCallback(() => {
        const savedRecords = localStorage.getItem('manufacturerProductionRecords');
        if (!savedRecords) return { 
            cookingOil: { quantity: 0, units: 0 },
            shampoo: { quantity: 0, units: 0 },
            margarine: { quantity: 0, units: 0 }
        };
        const records: Array<{ date: string; productName: string; quantity: number }> = JSON.parse(savedRecords);
        const existingRecords = records.filter((record) => record.date === date);
        const cookingOilRecords = existingRecords.filter((record) => record.productName === 'Cooking Oil');
        const shampooRecords = existingRecords.filter((record) => record.productName === 'Shampoo');
        const margarineRecords = existingRecords.filter((record) => record.productName === 'Margarine');
        return {
            cookingOil: {
                quantity: cookingOilRecords.reduce((total, record) => total + record.quantity, 0),
                units: Math.floor(cookingOilRecords.reduce((total, record) => total + record.quantity, 0) / productPackageSizes['Cooking Oil'])
            },
            shampoo: {
                quantity: shampooRecords.reduce((total, record) => total + record.quantity, 0),
                units: Math.floor(shampooRecords.reduce((total, record) => total + record.quantity, 0) / productPackageSizes['Shampoo'])
            },
            margarine: {
                quantity: margarineRecords.reduce((total, record) => total + record.quantity, 0),
                units: Math.floor(margarineRecords.reduce((total, record) => total + record.quantity, 0) / productPackageSizes['Margarine'])
            }
        };
    }, [date]);

    const [existingData, setExistingData] = useState({ 
        cookingOil: { quantity: 0, units: 0 },
        shampoo: { quantity: 0, units: 0 },
        margarine: { quantity: 0, units: 0 }
    });

    // Update existing data when date changes
    useEffect(() => {
        const data = getExistingData();
        setExistingData(data);
    }, [date, getExistingData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Get existing records
        const savedRecords = localStorage.getItem('manufacturerProductionRecords');
        let existingRecords: Array<{ id: string; productName: string; quantity: number; unit: string; timestamp: string; date: string }> = savedRecords ? JSON.parse(savedRecords) : [];
        
        // Remove existing records for the selected date
        existingRecords = existingRecords.filter((record) => record.date !== date);
        
        // Process each product that has units entered
        const products = [
            { name: 'Cooking Oil', units: cookingOilUnits, setter: setCookingOilUnits },
            { name: 'Shampoo', units: shampooUnits, setter: setShampooUnits },
            { name: 'Margarine', units: margarineUnits, setter: setMargarineUnits }
        ];
        
        let hasData = false;
        
        products.forEach(({ name, units, setter }) => {
            const unitCount = parseInt(units, 10);
            if (unitCount > 0) {
                const packageSize = productPackageSizes[name as keyof typeof productPackageSizes];
                const totalQuantity = unitCount * packageSize;
                
                // Create new record
                const newRecord = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    productName: name,
                    quantity: totalQuantity,
                    unit: name === 'Cooking Oil' ? 'ml' : name === 'Shampoo' ? 'ml' : 'g',
                    timestamp: new Date().toISOString(),
                    date: date,
                };
                
                existingRecords.push(newRecord);
                setter('');
                hasData = true;
            }
        });
        
        // Save updated records
        localStorage.setItem('manufacturerProductionRecords', JSON.stringify(existingRecords));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('localStorageChange'));
        
        if (hasData) {
            setDate(new Date().toISOString().split('T')[0]);
        }
    };

    return (
        <div className="bg-white rounded shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Add Production Data</h3>
            <p className="mb-6 text-gray-600">Add production data by entering the number of units (packages) produced. The system will automatically calculate total quantities.</p>
            
            {/* Existing Data Display */}
            {(existingData.cookingOil.quantity > 0 || existingData.shampoo.quantity > 0 || existingData.margarine.quantity > 0) && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Existing Data for {date}</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                        {existingData.cookingOil.quantity > 0 && (
                            <p><strong>Cooking Oil:</strong> {existingData.cookingOil.units} jerricans ({existingData.cookingOil.quantity.toLocaleString()} ml)</p>
                        )}
                        {existingData.shampoo.quantity > 0 && (
                            <p><strong>Shampoo:</strong> {existingData.shampoo.units} tubes ({existingData.shampoo.quantity.toLocaleString()} ml)</p>
                        )}
                        {existingData.margarine.quantity > 0 && (
                            <p><strong>Margarine:</strong> {existingData.margarine.units} containers ({existingData.margarine.quantity.toLocaleString()} g)</p>
                        )}
                        <p className="text-xs mt-2">New data will replace existing production for this date.</p>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="h-12" />
                </div>
                
                {/* Cooking Oil Input */}
                <div className="space-y-3">
                    <Label htmlFor="cookingOil" className="text-sm font-medium">Cooking Oil (jerricans)</Label>
                    <Input 
                        id="cookingOil" 
                        type="number" 
                        value={cookingOilUnits} 
                        onChange={(e) => setCookingOilUnits(e.target.value)} 
                        className="h-12" 
                        placeholder="Enter number of jerricans"
                        min="0"
                    />
                    <div className="text-xs text-gray-500">1 jerrican = 500 ml</div>
                </div>
                
                {/* Shampoo Input */}
                <div className="space-y-3">
                    <Label htmlFor="shampoo" className="text-sm font-medium">Shampoo (tubes)</Label>
                    <Input 
                        id="shampoo" 
                        type="number" 
                        value={shampooUnits} 
                        onChange={(e) => setShampooUnits(e.target.value)} 
                        className="h-12" 
                        placeholder="Enter number of tubes"
                        min="0"
                    />
                    <div className="text-xs text-gray-500">1 tube = 200 ml</div>
                </div>
                
                {/* Margarine Input */}
                <div className="space-y-3">
                    <Label htmlFor="margarine" className="text-sm font-medium">Margarine (containers)</Label>
                    <Input 
                        id="margarine" 
                        type="number" 
                        value={margarineUnits} 
                        onChange={(e) => setMargarineUnits(e.target.value)} 
                        className="h-12" 
                        placeholder="Enter number of containers"
                        min="0"
                    />
                    <div className="text-xs text-gray-500">1 container = 400 g</div>
                </div>
                
                <Button type="submit" className="w-full h-12 text-base font-medium">
                    {(existingData.cookingOil.quantity > 0 || existingData.shampoo.quantity > 0 || existingData.margarine.quantity > 0) ? 'Replace Existing Data' : 'Add Entry'}
                </Button>
            </form>
        </div>
    );
}

function DashboardAnalytics({ dashboard }: { dashboard: string }) {
    const [productionData, setProductionData] = useState<ProductionEntry[]>(initialProductionData);
    // Always call useStockStore at the top
    const factoryStock = useStockStore((state) => state.stock);

    // Load production data from localStorage for manufacturer
    useEffect(() => {
        const loadProductionData = () => {
            if (dashboard === 'manufacturer') {
                const savedRecords = localStorage.getItem('manufacturerProductionRecords');
                if (savedRecords) {
                    const records = JSON.parse(savedRecords);
                    
                    // Convert records to the format expected by charts
                    const dateMap: { [date: string]: { [product: string]: number } } = {};
                    
                    records.forEach((record: { date: string; productName: string; quantity: number }) => {
                        if (!dateMap[record.date]) {
                            dateMap[record.date] = {};
                        }
                        if (!dateMap[record.date][record.productName]) {
                            dateMap[record.date][record.productName] = 0;
                        }
                        dateMap[record.date][record.productName] += record.quantity;
                    });
                    
                    const convertedData = Object.entries(dateMap)
                        .map(([date, products]) => ({
                            date,
                            'Cooking Oil': products['Cooking Oil'] || 0,
                            'Shampoo': products['Shampoo'] || 0,
                            'Margarine': products['Margarine'] || 0,
                        }))
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    
                    setProductionData(convertedData.length > 0 ? convertedData : initialProductionData);
                }
            }
        };

        // Load data initially
        loadProductionData();

        // Listen for localStorage changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'manufacturerProductionRecords' && dashboard === 'manufacturer') {
                loadProductionData();
            }
        };

        // Listen for custom events (for same-tab updates)
        const handleCustomStorageChange = () => {
            if (dashboard === 'manufacturer') {
                loadProductionData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageChange', handleCustomStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageChange', handleCustomStorageChange);
        };
    }, [dashboard]);

    // Calculate analytics data based on current production data
    const analyticsData = useMemo(() => {
        const productNames = productionData.length > 0 ? Object.keys(productionData[0]).filter(key => key !== 'date') : [];
        const totalProduction = productNames.reduce((acc, productName) => {
            acc[productName] = productionData.reduce((sum, entry) => sum + Number(entry[productName as keyof ProductionEntry] ?? 0), 0);
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(totalProduction).map(([name, value]) => ({ name, value }));
    }, [productionData]);

    // Calculate average production
    const { averageProduction, productNames, totalProduction } = useMemo(() => {
        const productNames = productionData.length > 0 ? Object.keys(productionData[0]).filter(key => key !== 'date') : [];
        const totalProduction = productNames.reduce((acc, productName) => {
            acc[productName] = productionData.reduce((sum, entry) => sum + Number(entry[productName as keyof ProductionEntry] ?? 0), 0);
            return acc;
        }, {} as Record<string, number>);
        const averageProduction = productNames.reduce((acc, productName) => {
            const total = totalProduction[productName];
            const count = productionData.filter(entry => Number(entry[productName as keyof ProductionEntry] ?? 0) > 0).length;
            acc[productName] = count > 0 ? total / count : 0;
            return acc;
        }, {} as Record<string, number>);

        return { totalProduction, averageProduction, productNames };
    }, [productionData]);

    // Move all variable declarations outside of case blocks
    // For 'factory-store'
    const stockByBoxData: { name: string; boxes: number }[] = factoryStock.map(item => {
        const currentPackages = Math.floor(item.quantity / item.packageSize);
        const currentBoxes = Math.floor(currentPackages / item.boxSize);
        return { name: item.name, boxes: currentBoxes };
    });
    // For 'distributor'
    let distributorStock = {
        cookingOil: 450,
        shampoo: 280,
        margarine: 320,
    };
    if (dashboard === 'distributor' && typeof window !== 'undefined') {
        const stored = localStorage.getItem('distributorStock');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed === 'object') distributorStock = parsed;
            } catch { /* ignore error, fallback to default distributorStock */ }
        }
    }
    const productCards = [
        { name: 'Cooking Oil', value: distributorStock.cookingOil },
        { name: 'Shampoo', value: distributorStock.shampoo },
        { name: 'Soft Margarine', value: distributorStock.margarine },
    ];
    const statusData = [
        { status: 'Sufficient', count: [distributorStock.cookingOil, distributorStock.shampoo, distributorStock.margarine].filter(v => v > 400).length },
        { status: 'Low', count: [distributorStock.cookingOil, distributorStock.shampoo, distributorStock.margarine].filter(v => v > 0 && v <= 400).length },
        { status: 'Out of Stock', count: [distributorStock.cookingOil, distributorStock.shampoo, distributorStock.margarine].filter(v => v === 0).length },
    ];
    // For 'admin'
    let acceptedVendors: string[] = [];
    let rejectedVendors: string[] = [];
    let pdfFiles: { name: string }[] = [];
    let workforceTasks: { date?: string; department?: string }[] = [];
    if (dashboard === 'admin' && typeof window !== 'undefined') {
        acceptedVendors = JSON.parse(localStorage.getItem('acceptedVendors') || '[]');
        rejectedVendors = JSON.parse(localStorage.getItem('rejectedVendors') || '[]');
        pdfFiles = JSON.parse(localStorage.getItem('pdfFiles') || '[]');
        workforceTasks = JSON.parse(localStorage.getItem('workforceTasks') || '[]');
    }
    // Pie chart data for submitted vs processed applications
    const processedCount = acceptedVendors.length + rejectedVendors.length;
    const submittedCount = pdfFiles.length;
    const submissionPieData = [
        { name: 'No Feedback', value: submittedCount },
        { name: 'Given feedback', value: processedCount },
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
    workforceTasks.forEach((task) => {
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
    workforceTasks.forEach((task) => {
        const dept = task.department || 'Unknown';
        departmentCountMap[dept] = (departmentCountMap[dept] || 0) + 1;
    });
    const departmentBarData: DepartmentBar[] = Object.entries(departmentCountMap).map(([department, count]) => ({ department, count }));
    // Approval rate percentage
    const feedbackCount = pdfFiles.filter((f) =>
        acceptedVendors.includes(f.name.replace(/\.pdf$/i, '')) ||
        rejectedVendors.includes(f.name.replace(/\.pdf$/i, ''))
    ).length;
    const noFeedbackCount = pdfFiles.length - feedbackCount;
    // Percentages for accepted and rejected
    const totalProcessed = acceptedVendors.length + rejectedVendors.length;
    const acceptedPercent = totalProcessed > 0 ? (acceptedVendors.length / totalProcessed) * 100 : 0;
    const rejectedPercent = totalProcessed > 0 ? (rejectedVendors.length / totalProcessed) * 100 : 0;
    // Approval rate percentage (portion of 'Given feedback' in the pie chart)
    const approvalRatePieTotal = processedCount + noFeedbackCount;
    const approvalRatePiePercent = approvalRatePieTotal > 0 ? (processedCount / approvalRatePieTotal) * 100 : 0;

    // For 'unofficial-vendor'
    let vendorAcceptedVendors: string[] = [];
    let vendorRejectedVendors: string[] = [];
    let vendorPieData: { name: string; value: number }[] = [];
    let totalVendors = 0;
    let vendorAcceptedPercent = 0;
    let vendorRejectedPercent = 0;
    if (dashboard === 'unofficial-vendor' && typeof window !== 'undefined') {
        const saved = localStorage.getItem('acceptedVendors');
        vendorAcceptedVendors = saved ? JSON.parse(saved) : [];
        const savedRejected = localStorage.getItem('rejectedVendors');
        vendorRejectedVendors = savedRejected ? JSON.parse(savedRejected) : [];
        vendorPieData = [
            { name: 'Accepted', value: vendorAcceptedVendors.length },
            { name: 'Rejected', value: vendorRejectedVendors.length },
        ];
        totalVendors = vendorAcceptedVendors.length + vendorRejectedVendors.length;
        vendorAcceptedPercent = totalVendors > 0 ? (vendorAcceptedVendors.length / totalVendors) * 100 : 0;
        vendorRejectedPercent = totalVendors > 0 ? (vendorRejectedVendors.length / totalVendors) * 100 : 0;
    }

    switch (dashboard) {
        case 'manufacturer':
            return (
                <div className="bg-blue-50 p-6 rounded shadow">
                    {/* Removed notification display as per edit hint */}
                    <h2 className="text-4xl font-extrabold mb-2 text-center">Manufacturer Analytics</h2>
                    <p className="text-lg text-gray-700 text-center mb-6">Production, supply chain, and factory performance analytics go here.</p>
                    
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
                            <AddProductionDataCard />
                        </div>
                    </div>

                    {/* Production Records Section */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4">Production Records</h3>
                        <div className="bg-white rounded shadow p-4 border border-blue-200">
                            {(() => {
                                const savedRecords = localStorage.getItem('manufacturerProductionRecords');
                                const records = savedRecords ? JSON.parse(savedRecords) : [];
                                
                                if (records.length === 0) {
                                    return (
                                        <div className="text-center text-gray-500 py-8">
                                            <p>No production records found.</p>
                                            <p className="text-sm mt-2">Add production data using the form above or from the manufacturer dashboard.</p>
                                        </div>
                                    );
                                }
                                
                                return (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-blue-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-900 uppercase">Date</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-900 uppercase">Product</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-900 uppercase">Quantity</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-900 uppercase">Unit</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-900 uppercase">Time</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-blue-200">
                                                {records
                                                    .sort((a: { timestamp: string }, b: { timestamp: string }) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                    .slice(0, 10)
                                                    .map((record: { id: string; date: string; productName: string; quantity: number; unit: string; timestamp: string }, index: number) => (
                                                        <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                                            <td className="px-4 py-2 text-sm">{record.date}</td>
                                                            <td className="px-4 py-2 text-sm font-medium">{record.productName}</td>
                                                            <td className="px-4 py-2 text-sm">{record.quantity.toLocaleString()}</td>
                                                            <td className="px-4 py-2 text-sm">{record.unit}</td>
                                                            <td className="px-4 py-2 text-sm">
                                                                {new Date(record.timestamp).toLocaleTimeString([], { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit',
                                                                    second: '2-digit'
                                                                })}
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        {records.length > 10 && (
                                            <div className="text-center text-sm text-gray-500 mt-2">
                                                Showing latest 10 records of {records.length} total records
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Production Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {productNames.map((productName) => (
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
                                        <strong>{productionData.filter(entry => Number(entry[productName as keyof ProductionEntry] ?? 0) > 0).length}</strong>
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
                    <div className="mt-8 space-y-8">
                        <CustomerOrderBarGraph />
                        <GeneralOrdersCard />
                        <AvailableRetailStockBarGraph />
                    </div>
                </div>
            );
        case 'distributor':
            return (
                <div className="bg-yellow-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Distributor Analytics</h2>
                    <p>Distribution, logistics, and delivery analytics go here.</p>
                    {/* Current Stock Distribution Pie Chart */}
                    <div className="bg-white shadow rounded-lg overflow-hidden mb-8 mt-8">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Current Stock Distribution</h3>
                            <p className="mt-1 text-sm text-gray-500">Breakdown of current stock for each product</p>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={productCards} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                            {productCards.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    {/* Stocks by Status Bar Chart */}
                    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Stocks by Status</h3>
                            <p className="mt-1 text-sm text-gray-500">Number of products in each stock status</p>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={statusData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="status" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#f59e0b" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'admin': {
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
        }
        case 'customer':
            return (
                <div className="bg-blue-100 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Customer Analytics</h2>
                    <p>Order history, preferences, and engagement analytics go here.</p>
                    <div className="mt-8 space-y-8">
                        <CustomerOrderBarGraph />
                        <GeneralOrdersCard />
                    </div>
                </div>
            );
        case 'factory-store':
            return (
                <div className="bg-purple-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Factory Store Analytics</h2>
                    <p>Analytics for stock, sales, and performance in the factory store.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <StockByBoxGraphCard data={stockByBoxData} />
                        <AvailableStockBarGraph />
                    </div>
                </div>
            );
        case 'farmer':
            // Farmer: show Monthly Production (litres) bar chart from localStorage
            const [editableHarvestData, setEditableHarvestData] = React.useState<any[]>([]);
            React.useEffect(() => {
                if (typeof window !== 'undefined') {
                    const saved = localStorage.getItem('editableHarvestData');
                    if (saved) setEditableHarvestData(JSON.parse(saved));
                }
            }, []);
            return (
                <div className="bg-yellow-50 p-6 rounded shadow">
                    <h2 className="text-4xl font-extrabold mb-2 text-center">Farmer Analytics</h2>
                    <p className="text-lg text-gray-700 text-center mb-6">Production trends and harvest analytics for your farm.</p>
                    <div className="bg-white rounded shadow p-4">
                        <h3 className="text-xl font-semibold mb-2">Monthly Production (litres)</h3>
                        <p className="mb-4 text-gray-600">Coconut Oil and Crude Palm Oil production for the last 6 months.</p>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={editableHarvestData.slice(-6)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis label={{ value: 'Monthly Production (litres)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="coconutOil" fill="#4CAF50" name="Coconut Oil" />
                                    <Bar dataKey="crudePalmOil" fill="#2196F3" name="Crude Palm Oil" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            );
        case 'inventory-manager':
            // --- INVENTORY ANALYTICS CARDS LOGIC ---
            // Colors for charts
            const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
            // Inventory orders from localStorage
            const [inventoryOrders, setInventoryOrders] = useState<any[]>([]);
            useEffect(() => {
                if (typeof window !== 'undefined') {
                    const savedInventoryOrders = localStorage.getItem('inventoryOrders');
                    if (savedInventoryOrders) setInventoryOrders(JSON.parse(savedInventoryOrders));
                }
            }, []);
            // Oil types data
            const [palmOilStock, setPalmOilStock] = useState(150);
            const [coconutOilStock, setCoconutOilStock] = useState(80);
            useEffect(() => {
                if (typeof window !== 'undefined') {
                    const savedPalmOil = localStorage.getItem('palmOilStock');
                    const savedCoconutOil = localStorage.getItem('coconutOilStock');
                    if (savedPalmOil) setPalmOilStock(parseInt(savedPalmOil) || 150);
                    if (savedCoconutOil) setCoconutOilStock(parseInt(savedCoconutOil) || 80);
                }
            }, []);
            const updatedOilTypesData = [
                { name: 'Palm Oil', value: palmOilStock },
                { name: 'Coconut Oil', value: coconutOilStock },
            ];
            // Turnover data (mock or from localStorage)
            const turnoverData = [
                { month: 'Jan', turnover: 85 },
                { month: 'Feb', turnover: 78 },
                { month: 'Mar', turnover: 92 },
                { month: 'Apr', turnover: 88 },
                { month: 'May', turnover: 95 },
                { month: 'Jun', turnover: 82 },
            ];
            return (
                <div className="bg-teal-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Inventory Manager Analytics</h2>
                    <p>Inventory levels, restocking, and supply chain analytics go here.</p>
                    {/* Inventory Analytics Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-8">
                        {/* Order Quantity Trends (Last 7 Orders) */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded shadow p-4 mb-6">
                                <h3 className="text-xl font-semibold mb-2">Order Quantity Trends (Last 7 Orders)</h3>
                                <p className="mb-4 text-gray-600">Variance of Palm Oil and Coconut Oil quantities in recent farm orders</p>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={(() => {
                                            const last7Orders = inventoryOrders
                                                .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                .slice(0, 7)
                                                .reverse();
                                            return last7Orders.map((order: any, index: number) => ({
                                                order: `Order ${index + 1}`,
                                                'Palm Oil': order.palmOilQuantity,
                                                'Coconut Oil': order.coconutOilQuantity,
                                                date: new Date(order.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                            }));
                                        })()}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="order" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="Palm Oil" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                                            <Line type="monotone" dataKey="Coconut Oil" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                </div>
                            </div>
                        </div>
                        {/* Oil Type Distribution */}
                        <div>
                            <div className="bg-white rounded shadow p-4 mb-6">
                                <h3 className="text-xl font-semibold mb-2">Oil Type Distribution</h3>
                                <p className="mb-4 text-gray-600">Current inventory by oil type</p>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={updatedOilTypesData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                            >
                                                {updatedOilTypesData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Supply vs Demand Analysis & Inventory Turnover Rate */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Supply vs Demand Analysis */}
                        <div className="bg-white rounded shadow p-4 mb-6">
                            <h3 className="text-xl font-semibold mb-2">Supply vs Demand Analysis</h3>
                            <p className="mb-4 text-gray-600">Total expected to be delivered today</p>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={(() => {
                                        const today = new Date().toISOString().split('T')[0];
                                        const todayInventoryDeliveries = inventoryOrders
                                            .filter((order: any) => order.deliveryDate === today)
                                            .reduce((acc: any, order: any) => {
                                                acc.palmOil += order.palmOilQuantity;
                                                acc.coconutOil += order.coconutOilQuantity;
                                                return acc;
                                            }, { palmOil: 0, coconutOil: 0 });
                                        const todayManufacturerDeliveries = (() => {
                                            const manufacturerOrders = JSON.parse(localStorage.getItem('manufacturerOrders') || '[]');
                                            return manufacturerOrders
                                                .filter((order: any) => order.deliveryDate === today)
                                                .reduce((acc: any, order: any) => {
                                                    acc.palmOil += order.palmOilQuantity || 0;
                                                    acc.coconutOil += order.coconutOilQuantity || 0;
                                                    return acc;
                                                }, { palmOil: 0, coconutOil: 0 });
                                        })();
                                        return [
                                            {
                                                category: 'Palm Oil',
                                                'Expected Today': todayInventoryDeliveries.palmOil + todayManufacturerDeliveries.palmOil,
                                            },
                                            {
                                                category: 'Coconut Oil',
                                                'Expected Today': todayInventoryDeliveries.coconutOil + todayManufacturerDeliveries.coconutOil,
                                            }
                                        ];
                                    })()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Expected Today" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {/* Inventory Turnover Rate */}
                        <div className="bg-white rounded shadow p-4 mb-6">
                            <h3 className="text-xl font-semibold mb-2">Inventory Turnover Rate</h3>
                            <p className="mb-4 text-gray-600">Monthly turnover for different oil types</p>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={turnoverData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="turnover" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'unofficial-vendor':
            return (
                <div className="bg-blue-50 border-2 border-purple-600 p-6 rounded-xl shadow">
                    <h2 className="text-2xl font-bold text-black-900 mb-6">Vendor Application Analytics</h2>
                    {/* Summary Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-black-900 mb-4">Application Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white rounded p-4 text-center border border-purple-200">
                                <div className="text-3xl font-bold text-green-600">{vendorAcceptedVendors.length}</div>
                                <div className="text-gray-700 mt-1">Accepted Applications</div>
                            </div>
                            <div className="bg-white rounded p-4 text-center border border-purple-200">
                                <div className="text-3xl font-bold text-red-600">{vendorRejectedVendors.length}</div>
                                <div className="text-gray-700 mt-1">Rejected Applications</div>
                            </div>
                        </div>
                    </div>
                    {/* Pie Chart Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-black-900 mb-4">Application Status Distribution</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded shadow p-4 border border-purple-200">
                                <h4 className="text-lg font-semibold mb-2 text-black-900">Accepted vs Rejected Applications</h4>
                                <div className="flex items-center justify-center gap-6 mb-4">
                                    <span className="text-xl font-bold text-green-600">Accepted: {totalVendors > 0 ? `${vendorAcceptedPercent.toFixed(1)}%` : 'N/A'}</span>
                                    <span className="text-xl font-bold text-red-600">Rejected: {totalVendors > 0 ? `${vendorRejectedPercent.toFixed(1)}%` : 'N/A'}</span>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie 
                                                data={vendorPieData} 
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
                                            <Tooltip formatter={(value) => [`${value} applications`, 'Applications']} />
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
                                        <strong className="text-xl text-purple-600">{totalVendors}</strong>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="font-medium text-black-900">Accepted Rate:</span>
                                        <strong className="text-xl text-green-600">{totalVendors > 0 ? `${vendorAcceptedPercent.toFixed(1)}%` : '0%'}</strong>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <span className="font-medium text-black-900">Rejection Rate:</span>
                                        <strong className="text-xl text-red-600">{totalVendors > 0 ? `${vendorRejectedPercent.toFixed(1)}%` : '0%'}</strong>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="font-medium text-black-900">Processing Status:</span>
                                        <strong className="text-xl text-blue-600">{totalVendors > 0 ? 'Complete' : 'No Data'}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Application Status Note */}
                    <div className="bg-purple-50 border border-purple-200 rounded p-4">
                        <h4 className="font-semibold text-purple-900 mb-2">Analytics Information</h4>
                        <p className="text-purple-800 text-sm">
                            • <strong>Accepted Applications:</strong> Vendors who have been approved and are required to visit the company.<br/>
                            • <strong>Rejected Applications:</strong> Applications that did not meet the required criteria or had incomplete information.<br/>
                            • <strong>Data Source:</strong> Real-time data from the vendor application system.
                        </p>
                    </div>
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

function StockByBoxGraphCard({ data }: { data: { name: string, boxes: number }[] }) {
    return (
        <div className="bg-white rounded shadow p-4 mt-6">
            <h3 className="text-xl font-semibold mb-2">Stock by Box (Graph)</h3>
            <p className="mb-4 text-gray-600">A visual representation of the number of boxes for each product.</p>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="boxes" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function AvailableStockBarGraph() {
    const stock = useStockStore((state) => state.stock);
    const data = stock.map(item => ({ name: item.name, quantity: item.quantity, unit: item.unit }));
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl mx-auto mt-8">
            <h3 className="text-lg font-bold mb-2">Available Stock in Units</h3>
            <p className="mb-4 text-gray-600">Current available stock for each product.</p>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value, name, props) => [`${value} ${props.payload.unit}`, 'Quantity']} />
                        <Legend />
                        <Bar dataKey="quantity" fill="#6366f1" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function CustomerOrderBarGraph() {
    const [orderData, setOrderData] = useState<{ name: string; quantity: number }[]>([]);

    useEffect(() => {
        const loadOrderData = () => {
            if (typeof window !== 'undefined') {
                const savedOrders = localStorage.getItem('customerOrders');
                if (savedOrders) {
                    const orders: Array<{ items: Array<{ name: string; quantity: number }> }> = JSON.parse(savedOrders);
                    
                    // Aggregate product quantities and count orders for each product
                    const productTotals: { [key: string]: number } = {};
                    const productOrderCounts: { [key: string]: number } = {};
                    
                    orders.forEach((order) => {
                        if (order.items && Array.isArray(order.items)) {
                            order.items.forEach((item) => {
                                if (item.name && item.quantity) {
                                    productTotals[item.name] = (productTotals[item.name] || 0) + item.quantity;
                                    productOrderCounts[item.name] = (productOrderCounts[item.name] || 0) + 1;
                                }
                            });
                        }
                    });
                    
                    // Convert to array format for chart with averages
                    const chartData = Object.entries(productTotals).map(([name, totalQuantity]) => {
                        const orderCount = productOrderCounts[name] || 1;
                        const averageQuantity = totalQuantity / orderCount;
                        return {
                            name,
                            quantity: Math.round(averageQuantity * 100) / 100 // Round to 2 decimal places
                        };
                    });
                    
                    setOrderData(chartData);
                }
            }
        };

        loadOrderData();
        
        // Listen for changes in localStorage
        const handleStorageChange = () => {
            loadOrderData();
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageChange', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageChange', handleStorageChange);
        };
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full">
            <h3 className="text-lg font-bold mb-2">Average Product Order History</h3>
            <p className="mb-4 text-gray-600">Average quantity of each product per order from order status.</p>
            {orderData.length > 0 ? (
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={orderData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value} units`, 'Average Quantity']} />
                            <Legend />
                            <Bar dataKey="quantity" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-72 w-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <p className="text-lg">No order history found</p>
                        <p className="text-sm">Place some orders to see your analytics here</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function GeneralOrdersCard() {
    const [orders, setOrders] = useState<Array<{ id: string; date: string; items: Array<{ name: string; quantity: number; price?: number }>; total: number; discountedAmount: number }>>([]);

    useEffect(() => {
        const loadOrders = () => {
            if (typeof window !== 'undefined') {
                const savedOrders = localStorage.getItem('customerOrders');
                if (savedOrders) {
                    const parsedOrders: Array<{ id: string; date: string; items: Array<{ name: string; quantity: number; price?: number }>; total: number; discountedAmount: number }> = JSON.parse(savedOrders);
                    setOrders(parsedOrders);
                }
            }
        };

        loadOrders();
        
        // Listen for changes in localStorage
        const handleStorageChange = () => {
            loadOrders();
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageChange', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageChange', handleStorageChange);
        };
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full">
            <h3 className="text-lg font-bold mb-4">General Orders</h3>
            <p className="mb-6 text-gray-600">All orders from order status showing complete order details.</p>
            
            {orders.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <p className="text-lg">No orders found</p>
                    <p className="text-sm">Place some orders to see them here</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Order Date</th>
                                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Products</th>
                                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Total Amount</th>
                                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Amount Paid</th>
                                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Discount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(order.date).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className="space-y-1">
                                            {order.items && order.items.map((item: { name: string; quantity: number; price?: number }, itemIndex: number) => (
                                                <div key={itemIndex} className="text-sm">
                                                    {item.name} x {item.quantity} @ Ugx {item.price?.toLocaleString()}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        Ugx {Number(order.total).toLocaleString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        Ugx {Number(order.discountedAmount).toLocaleString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
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
            )}
        </div>
    );
}

// Add AvailableRetailStockBarGraph component
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
            setStockData(parsed.map((p: { name: string; stock: number }) => ({ name: p.name, stock: p.stock })));
          }
        } catch { /* ignore error */ }
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

export default function Analytics() {
    // Prefer the dashboard prop from Inertia, fallback to query string
    const { dashboard: dashboardProp } = usePage().props as { dashboard?: string };
    const dashboard = dashboardProp || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('dashboard') || '' : '');

    return (
        <AppLayout>
            <div>
                <Head title="Analytics" />
                <div className="container mx-auto px-4 py-8">
                    <DashboardAnalytics dashboard={dashboard} />
                </div>
            </div>
        </AppLayout>
    );
} 