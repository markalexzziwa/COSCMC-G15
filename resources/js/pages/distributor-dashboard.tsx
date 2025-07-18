import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FiPackage, FiTruck, FiDollarSign, FiAlertCircle, FiTrendingUp, FiUsers } from 'react-icons/fi';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface Order {
  id: number;
  customer: string;
  product: string;
  quantity: number;
  status: 'pending' | 'processing' | 'shipped';
}

interface InventoryData {
  totalStock: number;
  lowStockItems: number;
  criticalStockItems: number;
}

interface OrdersData {
  pending: number;
  processing: number;
  delivered: number;
}

interface SalesData {
  monthly: number;
  weekly: number;
  daily: number;
}

interface DistributionData {
  byProduct: {
    labels: string[];
    data: number[];
  };
  byRegion: {
    labels: string[];
    data: number[];
  };
}

interface DashboardData {
  inventory: InventoryData;
  orders: OrdersData;
  sales: SalesData;
  recentOrders: Order[];
  distribution: DistributionData;
}

export default function DistributorDashboard() {
    const [isVisible, setIsVisible] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'sales'>('overview');

    // Mock data - replace with real API calls
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        inventory: {
            totalStock: 1250,
            lowStockItems: 3,
            criticalStockItems: 1
        },
        orders: {
            pending: 8,
            processing: 5,
            delivered: 32
        },
        sales: {
            monthly: 28450,
            weekly: 7250,
            daily: 1250
        },
        recentOrders: [
            { id: 1001, customer: 'Restaurant A', product: 'Premium Olive Oil 5L', quantity: 10, status: 'shipped' },
            { id: 1002, customer: 'Hotel B', product: 'Vegetable Oil 20L', quantity: 5, status: 'processing' },
            { id: 1003, customer: 'Catering C', product: 'Sunflower Oil 10L', quantity: 8, status: 'pending' },
            { id: 1004, customer: 'Bakery D', product: 'Coconut Oil 5L', quantity: 15, status: 'shipped' }
        ],
        distribution: {
            byProduct: {
                labels: ['Vegetable Oil', 'Olive Oil', 'Sunflower Oil', 'Coconut Oil', 'Others'],
                data: [45, 30, 15, 8, 2]
            },
            byRegion: {
                labels: ['North', 'South', 'East', 'West'],
                data: [35, 25, 20, 20]
            }
        }
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);
    // Notification state for welcome message
    const [showNotification, setShowNotification] = useState(true);

    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => setShowNotification(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    return (
        <AppLayout>
            <Head title="Distributor Dashboard" />

            <div className="min-h-screen bg-gray-50">
                {/* Welcome Notification (top-right corner) */}
                {showNotification && (
                    <div className="fixed top-6 right-6 z-50">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-out">
                            <span className="font-medium">Welcome back! You're logged in as a Cooking Oil Distributor</span>
                        </div>
                    </div>
                )}

                {/* Main Dashboard Content */}
                <div className="py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Dashboard Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Distributor Dashboard</h1>
                            <p className="mt-2 text-gray-600">Manage your cooking oil distribution efficiently</p>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="border-b border-gray-200 mb-8">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('inventory')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'inventory' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Inventory
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Orders
                                </button>
                                <button
                                    onClick={() => setActiveTab('sales')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sales' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Sales Analytics
                                </button>
                            </nav>
                        </div>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    {/* Inventory Card */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                                    <FiPackage className="h-6 w-6 text-yellow-600" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Stock</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">{dashboardData.inventory.totalStock}</div>
                                                            <span className="ml-2 text-sm text-gray-500">liters</span>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-5 py-3">
                                            <div className="text-sm">
                                                <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500">
                                                    View inventory
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Orders Card */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                                    <FiTruck className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">{dashboardData.orders.pending}</div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-5 py-3">
                                            <div className="text-sm">
                                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                                    Process orders
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sales Card */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                                    <FiDollarSign className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Monthly Sales</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">${dashboardData.sales.monthly.toLocaleString()}</div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-5 py-3">
                                            <div className="text-sm">
                                                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                                                    View sales report
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alerts Card */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                                                    <FiAlertCircle className="h-6 w-6 text-red-600" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Critical Stock</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">{dashboardData.inventory.criticalStockItems}</div>
                                                            <span className="ml-2 text-sm text-gray-500">items</span>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-5 py-3">
                                            <div className="text-sm">
                                                <a href="#" className="font-medium text-red-600 hover:text-red-500">
                                                    Reorder now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Orders and Quick Actions */}
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    {/* Recent Orders */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
                                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
                                            <p className="mt-1 text-sm text-gray-500">Latest customer orders for cooking oil products</p>
                                        </div>
                                        <div className="bg-white overflow-hidden">
                                            <ul className="divide-y divide-gray-200">
                                                {dashboardData.recentOrders.map((order) => (
                                                    <li key={order.id} className="px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                                                    <div className="text-sm text-gray-500">{order.product}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="text-sm text-gray-500 mr-4">{order.quantity} units</span>
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                    order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                            <div className="text-sm">
                                                <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500">
                                                    View all orders
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                                            <p className="mt-1 text-sm text-gray-500">Frequently used distributor tasks</p>
                                        </div>
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="space-y-4">
                                                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                                    <FiPackage className="mr-2" /> Add New Inventory
                                                </button>
                                                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <FiTruck className="mr-2" /> Create New Order
                                                </button>
                                                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                                    <FiDollarSign className="mr-2" /> Record Payment
                                                </button>
                                                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                                    <FiUsers className="mr-2" /> Add New Customer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Distribution Graphs */}
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    {/* Product Distribution Pie Chart */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Product Distribution</h3>
                                            <p className="mt-1 text-sm text-gray-500">Breakdown of cooking oil products in inventory</p>
                                        </div>
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="h-80">
                                                <Pie 
                                                    data={{
                                                        labels: dashboardData.distribution.byProduct.labels,
                                                        datasets: [
                                                            {
                                                                data: dashboardData.distribution.byProduct.data,
                                                                backgroundColor: [
                                                                    'rgba(234, 179, 8, 0.7)',  // yellow-500
                                                                    'rgba(16, 185, 129, 0.7)',  // green-500
                                                                    'rgba(59, 130, 246, 0.7)',  // blue-500
                                                                    'rgba(139, 92, 246, 0.7)',  // purple-500
                                                                    'rgba(239, 68, 68, 0.7)'    // red-500
                                                                ],
                                                                borderColor: [
                                                                    'rgba(234, 179, 8, 1)',
                                                                    'rgba(16, 185, 129, 1)',
                                                                    'rgba(59, 130, 246, 1)',
                                                                    'rgba(139, 92, 246, 1)',
                                                                    'rgba(239, 68, 68, 1)'
                                                                ],
                                                                borderWidth: 1,
                                                            },
                                                        ],
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'right',
                                                            },
                                                            tooltip: {
                                                                callbacks: {
                                                                    label: function(context) {
                                                                        const label = context.label || '';
                                                                        const value = context.raw || 0;
                                                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                                    const numericValue = typeof value === 'number' ? value : Number(value);
                                                                    const numericTotal = Array.isArray(context.dataset.data)
                                                                        ? context.dataset.data.reduce((a, b) => Number(a) + Number(b), 0)
                                                                        : Number(total);
                                                                    const percentage = numericTotal > 0 ? Math.round((numericValue / numericTotal) * 100) : 0;
                                                                    return `${label}: ${numericValue} units (${percentage}%)`;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Regional Distribution Bar Chart */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Regional Distribution</h3>
                                            <p className="mt-1 text-sm text-gray-500">Sales by region for cooking oil products</p>
                                        </div>
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="h-80">
                                                <Bar
                                                    data={{
                                                        labels: dashboardData.distribution.byRegion.labels,
                                                        datasets: [
                                                            {
                                                                label: 'Sales Volume (%)',
                                                                data: dashboardData.distribution.byRegion.data,
                                                                backgroundColor: 'rgba(234, 179, 8, 0.7)',
                                                                borderColor: 'rgba(234, 179, 8, 1)',
                                                                borderWidth: 1,
                                                            },
                                                        ],
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        scales: {
                                                            y: {
                                                                beginAtZero: true,
                                                                max: 100,
                                                                ticks: {
                                                                    callback: function(value) {
                                                                        return value + '%';
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        plugins: {
                                                            tooltip: {
                                                                callbacks: {
                                                                    label: function(context) {
                                                                        return context.raw + '% of total sales';
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Inventory Tab */}
                        {activeTab === 'inventory' && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Cooking Oil Inventory</h3>
                                    <p className="mt-1 text-sm text-gray-500">Manage your current stock levels</p>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900">Current Stock Levels</h4>
                                            <p className="text-sm text-gray-500">Monitor and replenish your inventory</p>
                                        </div>
                                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                            <FiPackage className="mr-2" /> Add New Product
                                        </button>
                                    </div>
                                    
                                    {/* Inventory Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center">
                                                                <FiPackage className="h-6 w-6 text-yellow-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">Premium Olive Oil 5L</div>
                                                                <div className="text-sm text-gray-500">SKU: OLV-5000</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Olive Oil</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">320 units</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <a href="#" className="text-yellow-600 hover:text-yellow-900 mr-4">Edit</a>
                                                        <a href="#" className="text-blue-600 hover:text-blue-900">Reorder</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center">
                                                                <FiPackage className="h-6 w-6 text-yellow-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">Vegetable Oil 20L</div>
                                                                <div className="text-sm text-gray-500">SKU: VEG-2000</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Vegetable Oil</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45 units</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Low Stock</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <a href="#" className="text-yellow-600 hover:text-yellow-900 mr-4">Edit</a>
                                                        <a href="#" className="text-blue-600 hover:text-blue-900">Reorder</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center">
                                                                <FiPackage className="h-6 w-6 text-yellow-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">Sunflower Oil 10L</div>
                                                                <div className="text-sm text-gray-500">SKU: SFL-1000</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sunflower Oil</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12 units</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Critical</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <a href="#" className="text-yellow-600 hover:text-yellow-900 mr-4">Edit</a>
                                                        <a href="#" className="text-blue-600 hover:text-blue-900">Reorder</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center">
                                                                <FiPackage className="h-6 w-6 text-yellow-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">Coconut Oil 5L</div>
                                                                <div className="text-sm text-gray-500">SKU: CCN-5000</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Coconut Oil</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">78 units</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <a href="#" className="text-yellow-600 hover:text-yellow-900 mr-4">Edit</a>
                                                        <a href="#" className="text-blue-600 hover:text-blue-900">Reorder</a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Order Management</h3>
                                    <p className="mt-1 text-sm text-gray-500">Track and fulfill customer orders</p>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900">Recent Orders</h4>
                                            <p className="text-sm text-gray-500">Manage all customer orders in one place</p>
                                        </div>
                                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            <FiTruck className="mr-2" /> Create New Order
                                        </button>
                                    </div>
                                    
                                    {/* Order Status Summary */}
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                                        <FiAlertCircle className="h-6 w-6 text-yellow-600" />
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                                            <dd className="flex items-baseline">
                                                                <div className="text-2xl font-semibold text-gray-900">{dashboardData.orders.pending}</div>
                                                                <span className="ml-2 text-sm text-gray-500">orders</span>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                                        <FiTruck className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">Processing</dt>
                                                            <dd className="flex items-baseline">
                                                                <div className="text-2xl font-semibold text-gray-900">{dashboardData.orders.processing}</div>
                                                                <span className="ml-2 text-sm text-gray-500">orders</span>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                                        <FiPackage className="h-6 w-6 text-green-600" />
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">Delivered</dt>
                                                            <dd className="flex items-baseline">
                                                                <div className="text-2xl font-semibold text-gray-900">{dashboardData.orders.delivered}</div>
                                                                <span className="ml-2 text-sm text-gray-500">orders</span>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Orders Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {dashboardData.recentOrders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(order.quantity * 25).toFixed(2)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <a href="#" className="text-yellow-600 hover:text-yellow-900 mr-4">View</a>
                                                            <a href="#" className="text-blue-600 hover:text-blue-900">Process</a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sales Analytics Tab */}
                        {activeTab === 'sales' && (
                            <div className="space-y-6">
                                {/* Sales Summary Cards */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                                    <FiDollarSign className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Daily Sales</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">${dashboardData.sales.daily.toLocaleString()}</div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                                    <FiDollarSign className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Weekly Sales</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">${dashboardData.sales.weekly.toLocaleString()}</div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                                    <FiDollarSign className="h-6 w-6 text-purple-600" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Monthly Sales</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">${dashboardData.sales.monthly.toLocaleString()}</div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sales Chart (Placeholder) */}
                                <div className="bg-white shadow rounded-lg overflow-hidden">
                                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Sales Performance</h3>
                                        <p className="mt-1 text-sm text-gray-500">Monthly sales trends for cooking oil products</p>
                                    </div>
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="h-80 bg-gray-50 rounded-md flex items-center justify-center">
                                            <div className="text-center">
                                                <FiTrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-500">Sales chart visualization would appear here</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Products */}
                                <div className="bg-white shadow rounded-lg overflow-hidden">
                                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Top Selling Products</h3>
                                        <p className="mt-1 text-sm text-gray-500">Best performing cooking oil products</p>
                                    </div>
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center">
                                                                    <FiPackage className="h-6 w-6 text-yellow-600" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">Vegetable Oil 20L</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Vegetable Oil</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">245 units</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$6,125.00</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center">
                                                                    <FiPackage className="h-6 w-6 text-yellow-600" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">Premium Olive Oil 5L</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Olive Oil</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">180 units</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$9,000.00</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center">
                                                                    <FiPackage className="h-6 w-6 text-yellow-600" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">Sunflower Oil 10L</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sunflower Oil</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">150 units</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$3,750.00</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center">
                                                                    <FiPackage className="h-6 w-6 text-yellow-600" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">Coconut Oil 5L</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Coconut Oil</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">120 units</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$4,200.00</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}