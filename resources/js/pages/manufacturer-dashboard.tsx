import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, TrendingUp, Package, Clock, CheckCircle, Trash2 } from 'lucide-react'
import useStockStore from '@/store/useStockStore';

interface ProductionRecord {
    id: string;
    productName: string;
    quantity: number;
    unit: string;
    timestamp: string;
    date: string;
}

interface Product {
    name: string;
    unit: string;
    packageSize: number;
    packageUnit: string;
    image: string;
}

const products: Product[] = [
    { name: 'Cooking Oil', unit: 'ml', packageSize: 500, packageUnit: 'jerrican', image: '/cooking oil.jpg' },
    { name: 'Shampoo', unit: 'ml', packageSize: 200, packageUnit: 'tube', image: '/shampoo.jpg' },
    { name: 'Margarine', unit: 'g', packageSize: 400, packageUnit: 'container', image: '/soft magarine.jpg' },
];

export default function ManufacturerDashboard() {
    const [productionRecords, setProductionRecords] = useState<ProductionRecord[]>([]);
    const [newProduction, setNewProduction] = useState<Record<string, number>>({});
    const [notification, setNotification] = useState<string | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [dailyMachineNeeds, setDailyMachineNeeds] = useState<Record<string, number>>({
        'Machine 1 - Cooking Oil Processor': 0,
        'Machine 2 - Shampoo Mixer': 0
    });
    const [machineNeedsHistory, setMachineNeedsHistory] = useState<any[]>([]);
    const [rawMaterialOrder, setRawMaterialOrder] = useState({
        palmOil: 0,
        coconutOil: 0
    });
    const { addStock } = useStockStore();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Load production records from localStorage on component mount
    useEffect(() => {
        const savedRecords = localStorage.getItem('manufacturerProductionRecords');
        if (savedRecords) {
            setProductionRecords(JSON.parse(savedRecords));
        }
    }, []);

    // Load orders from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('factoryProductionOrders');
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

    // Load machine needs history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('machineNeedsHistory');
        if (savedHistory) {
            setMachineNeedsHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save machine needs history to localStorage
    useEffect(() => {
        localStorage.setItem('machineNeedsHistory', JSON.stringify(machineNeedsHistory));
    }, [machineNeedsHistory]);

    // Calculate total quantities needed for each product from orders
    const calculateTotalNeeded = (productName: string) => {
        return orders.reduce((total, order) => {
            if (order.items) {
                const productItem = order.items.find((item: any) => 
                    item.name.toLowerCase().includes(productName.toLowerCase())
                );
                if (productItem) {
                    return total + (parseInt(productItem.quantity) || 0);
                }
            }
            return total;
        }, 0);
    };

    // Handle updating daily machine needs
    const handleMachineNeedUpdate = (machineName: string, value: string) => {
        const numValue = value === '' ? 0 : parseInt(value, 10);
        setDailyMachineNeeds(prev => ({ ...prev, [machineName]: numValue }));
    };

    // Handle raw material order input changes
    const handleRawMaterialOrderChange = (material: string, value: string) => {
        const numValue = value === '' ? 0 : parseInt(value, 10);
        setRawMaterialOrder(prev => ({ ...prev, [material]: numValue }));
    };

    // Handle placing raw materials order
    const handlePlaceRawMaterialsOrder = () => {
        if (rawMaterialOrder.palmOil <= 0 && rawMaterialOrder.coconutOil <= 0) {
            setNotification('Please enter quantities greater than 0');
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        const order = {
            id: Date.now().toString(),
            date: today,
            timestamp: new Date().toISOString(),
            type: 'raw_materials',
            items: [
                ...(rawMaterialOrder.palmOil > 0 ? [{ name: 'Palm Oil', quantity: rawMaterialOrder.palmOil, unit: 'L' }] : []),
                ...(rawMaterialOrder.coconutOil > 0 ? [{ name: 'Coconut Oil', quantity: rawMaterialOrder.coconutOil, unit: 'L' }] : [])
            ],
            totalPalmOil: rawMaterialOrder.palmOil,
            totalCoconutOil: rawMaterialOrder.coconutOil
        };

        // Save to localStorage
        const existingOrders = JSON.parse(localStorage.getItem('rawMaterialOrders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('rawMaterialOrders', JSON.stringify(existingOrders));

        // Reset form
        setRawMaterialOrder({ palmOil: 0, coconutOil: 0 });
        
        setNotification(`Raw materials order placed: ${rawMaterialOrder.palmOil}L Palm Oil, ${rawMaterialOrder.coconutOil}L Coconut Oil`);
        setTimeout(() => setNotification(null), 3000);
    };

    // Save daily totals
    const handleSaveDailyTotals = () => {
        const dailyTotal = {
            date: today,
            timestamp: new Date().toISOString(),
            machineNeeds: { ...dailyMachineNeeds },
            totalPalmOil: dailyMachineNeeds['Machine 1 - Cooking Oil Processor'],
            totalCoconutOil: dailyMachineNeeds['Machine 2 - Shampoo Mixer']
        };

        setMachineNeedsHistory(prev => [...prev, dailyTotal]);
        setDailyMachineNeeds({
            'Machine 1 - Cooking Oil Processor': 0,
            'Machine 2 - Shampoo Mixer': 0
        });
        setNotification('Daily totals saved successfully!');
        setTimeout(() => setNotification(null), 3000);
    };

    // Get today's saved totals
    const getTodaySavedTotals = () => {
        return machineNeedsHistory.find(record => record.date === today);
    };

    const todaySavedTotals = getTodaySavedTotals();

    // Save production records to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('manufacturerProductionRecords', JSON.stringify(productionRecords));
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('localStorageChange'));
    }, [productionRecords]);

    // Get today's production records
    const todaysRecords = productionRecords.filter(record => record.date === today);

    // Calculate total production for today
    const totalProduction = todaysRecords.reduce((total, record) => total + record.quantity, 0);

    // Get today's production by product
    const getTodaysProductionByProduct = (productName: string) => {
        return todaysRecords
            .filter(record => record.productName === productName)
            .reduce((total, record) => total + record.quantity, 0);
    };

    const handleAddProduction = (productName: string) => {
        const packages = newProduction[productName] || 0;
        if (packages <= 0) {
            setNotification('Please enter a valid quantity greater than 0');
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        const product = products.find(p => p.name === productName);
        if (!product) return;

        const totalUnits = packages * product.packageSize;

        const newRecord: ProductionRecord = {
            id: Date.now().toString(),
            productName,
            quantity: totalUnits,
            unit: product.unit,
            timestamp: new Date().toISOString(),
            date: today,
        };

        setProductionRecords(prev => [...prev, newRecord]);
        setNewProduction(prev => ({ ...prev, [productName]: 0 }));
        setNotification(`Added ${packages} ${product.packageUnit}s (${totalUnits.toLocaleString()} ${product.unit}) of ${productName}`);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleInputChange = (productName: string, value: string) => {
        const numValue = value === '' ? 0 : parseInt(value, 10);
        setNewProduction(prev => ({ ...prev, [productName]: numValue }));
    };

    const handleClearHistory = () => {
        setProductionRecords([]);
        setNewProduction({});
        setNotification('Production history cleared successfully');
        setTimeout(() => setNotification(null), 3000);
    };

    const handleUpdateStock = () => {
        if (todaysRecords.length === 0) {
            setNotification('No production data to update stock with');
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        // Group production by product and sum quantities
        const productionByProduct = todaysRecords.reduce((acc, record) => {
            if (!acc[record.productName]) {
                acc[record.productName] = 0;
            }
            acc[record.productName] += record.quantity;
            return acc;
        }, {} as Record<string, number>);

        // Update stock for each product
        Object.entries(productionByProduct).forEach(([productName, quantity]) => {
            addStock(productName, quantity);
        });

        setNotification(`Stock updated successfully! Added production quantities to inventory.`);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <AppLayout>
            <div>
                <Head title="Manufacturer Dashboard" />
                
                {notification && (
                    <div className="fixed top-24 right-5 z-50 rounded-md bg-green-500 p-4 text-white shadow-lg animate-in fade-in-0 slide-in-from-top-5">
                        <p className="font-bold">Success!</p>
                        <p>{notification}</p>
                    </div>
                )}

                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Manufacturer Dashboard</h1>
                    <div className="mb-8">
                        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-blue-800">
                                        <TrendingUp className="h-6 w-6" />
                                        <span>Today's Production Summary</span>
                                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                            {today}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {todaysRecords.length > 0 && (
                                            <Button
                                                onClick={handleClearHistory}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Clear History
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handleUpdateStock}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                            disabled={todaysRecords.length === 0}
                                        >
                                            <Package className="h-4 w-4" />
                                            <span className="font-semibold">Update Stock</span>
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription>
                                    Total production quantity for all products today
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-white rounded-lg p-4 text-center border border-blue-200">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {totalProduction.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">Total Units</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center border border-blue-200">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {todaysRecords.length}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">Production Entries</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center border border-blue-200">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {products.length}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">Active Products</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center border border-blue-200">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {todaysRecords.length > 0 ? 
                                                new Date(todaysRecords[todaysRecords.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                                                'N/A'
                                            }
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">Last Entry</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Three summary cards: gh, hf, fd */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Last 24 Hours Production Request</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-blue-700 mb-2">Cooking Oil: {calculateTotalNeeded('Cooking Oil')} Jellycan</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Needed</span>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-blue-700 mb-2">Shampoo: {calculateTotalNeeded('Shampoo')} Bottles</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Needed</span>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-blue-700 mb-2">Soft Margarine: {calculateTotalNeeded('Soft Margarine')} Tubes</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Needed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Order History Card (synced with factory store) */}
                    <FactoryProductionOrderHistoryCardDashboard />

                    {/* Individual Product Production Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {products.map((product) => {
                            const todaysProduction = getTodaysProductionByProduct(product.name);
                            const currentInput = newProduction[product.name] || 0;
                            
                            return (
                                <Card key={product.name} className="bg-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-3">
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <span className="text-blue-800">{product.name}</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Today's production: {todaysProduction.toLocaleString()} {product.unit}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Today's Production Display */}
                                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-blue-700">Today's Production:</span>
                                                    <span className="text-lg font-bold text-blue-800">
                                                        {todaysProduction.toLocaleString()} {product.unit}
                                                    </span>
                                                </div>
                                                {todaysProduction === 0 && (
                                                    <div className="text-xs text-blue-600 mt-1 flex items-center">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        No production recorded today
                                                    </div>
                                                )}
                                                {todaysProduction > 0 && (
                                                    <div className="text-xs text-green-600 mt-1 flex items-center">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Production recorded
                                                    </div>
                                                )}
                                            </div>

                                                                                         {/* Add Production Input */}
                                             <div className="space-y-2">
                                                 <label className="text-sm font-medium text-gray-700">
                                                     Add Production ({product.packageUnit}s):
                                                 </label>
                                                 <div className="flex space-x-2">
                                                     <Input
                                                         type="number"
                                                         value={currentInput || ''}
                                                         onChange={(e) => handleInputChange(product.name, e.target.value)}
                                                         placeholder={`Enter ${product.packageUnit}s`}
                                                         className="flex-1"
                                                         min="0"
                                                     />
                                                     <Button
                                                         onClick={() => handleAddProduction(product.name)}
                                                         className="bg-blue-600 hover:bg-blue-700 text-white"
                                                         disabled={currentInput <= 0}
                                                     >
                                                         <Plus className="h-4 w-4" />
                                                     </Button>
                                                 </div>
                                                 <div className="text-xs text-gray-500">
                                                     1 {product.packageUnit} = {product.packageSize.toLocaleString()} {product.unit}
                                                 </div>
                                             </div>

                                                                                         {/* Recent Entries */}
                                             {todaysRecords
                                                 .filter(record => record.productName === product.name)
                                                 .slice(-3)
                                                 .map((record) => {
                                                     const packages = Math.floor(record.quantity / product.packageSize);
                                                     return (
                                                         <div key={record.id} className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                                                             <div className="flex justify-between items-center">
                                                                 <span>+{packages} {product.packageUnit}s ({record.quantity.toLocaleString()} {record.unit})</span>
                                                                 <span>{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                             </div>
                                                         </div>
                                                     );
                                                 })
                                             }
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Production History */}
                    {todaysRecords.length > 0 && (
                        <div className="mt-8">
                            <Card className="bg-white border-2 border-blue-200">
                                <CardHeader>
                                    <CardTitle className="text-blue-800">Today's Production History</CardTitle>
                                    <CardDescription>
                                        Detailed log of all production entries for {today}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                                                                 {todaysRecords
                                             .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                             .map((record) => {
                                                 const product = products.find(p => p.name === record.productName);
                                                 const packages = product ? Math.floor(record.quantity / product.packageSize) : 0;
                                                 return (
                                                     <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                         <div className="flex items-center space-x-3">
                                                             <Package className="h-4 w-4 text-blue-600" />
                                                             <span className="font-medium">{record.productName}</span>
                                                             <span className="text-blue-600 font-bold">
                                                                 +{packages} {product?.packageUnit}s ({record.quantity.toLocaleString()} {record.unit})
                                                             </span>
                                                         </div>
                                                         <span className="text-sm text-gray-500">
                                                             {new Date(record.timestamp).toLocaleTimeString([], { 
                                                                 hour: '2-digit', 
                                                                 minute: '2-digit',
                                                                 second: '2-digit'
                                                             })}
                                                         </span>
                                                     </div>
                                                 );
                                             })
                                         }
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* XYZ Card */}
                    <div className="mt-8">
                        <Card className="bg-white border-2 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-blue-800">Raw Materials Order</CardTitle>
                                <CardDescription>
                                    Order raw materials needed for production
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Palm Oil (Liters)</label>
                                            <Input
                                                type="number"
                                                value={rawMaterialOrder.palmOil || ''}
                                                onChange={(e) => handleRawMaterialOrderChange('palmOil', e.target.value)}
                                                placeholder="Enter quantity"
                                                className="w-full"
                                                min="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Coconut Oil (Liters)</label>
                                            <Input
                                                type="number"
                                                value={rawMaterialOrder.coconutOil || ''}
                                                onChange={(e) => handleRawMaterialOrderChange('coconutOil', e.target.value)}
                                                placeholder="Enter quantity"
                                                className="w-full"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button 
                                            onClick={handlePlaceRawMaterialsOrder}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            disabled={rawMaterialOrder.palmOil <= 0 && rawMaterialOrder.coconutOil <= 0}
                                        >
                                            Place Raw Materials Order
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Raw Material Needed at Processing Machine */}
                    <div className="mt-8">
                        <Card className="bg-white border-2 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-blue-800">Raw Material Order History</CardTitle>
                                <CardDescription>
                                    History of raw material orders placed
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {(() => {
                                        const rawMaterialOrders = JSON.parse(localStorage.getItem('rawMaterialOrders') || '[]');
                                        if (rawMaterialOrders.length === 0) {
                                            return (
                                                <div className="text-center py-8 text-gray-500">
                                                    No raw material orders found.
                                                </div>
                                            );
                                        }

                                        // Group orders by timestamp (same time = same order)
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

                                        // Convert to array and sort by timestamp (newest first)
                                        const sortedGroups = Object.values(groupedOrders)
                                            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                                        return (
                                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                                {sortedGroups.map((group: any, index: number) => (
                                                    <div key={group.timestamp} className="p-4 bg-gray-50 rounded-lg border">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-medium text-gray-800">
                                                                    Order #{index + 1}
                                                                </h4>
                                                                <p className="text-sm text-gray-600">
                                                                    {new Date(group.timestamp).toLocaleDateString()} at {new Date(group.timestamp).toLocaleTimeString()}
                                                                </p>
                                                                {group.orders.length > 1 && (
                                                                    <p className="text-xs text-blue-600 mt-1">
                                                                        {group.orders.length} items ordered
                                                                    </p>
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
                            </CardContent>
                        </Card>
                    </div>
                 </div>


             </div>
         </AppLayout>
     )
} 

function FactoryProductionOrderHistoryCardDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
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