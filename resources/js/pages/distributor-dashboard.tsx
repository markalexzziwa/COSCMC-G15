import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FiPackage, FiTruck, FiDollarSign, FiAlertCircle, FiTrendingUp, FiUsers, FiPocket } from 'react-icons/fi';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
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

// Add RetailOrderHistory component for distributor dashboard
function RetailOrderHistory() {
  const [orders, setOrders] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('retailOrders');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed.reverse() : [];
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    const loadOrders = () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('retailOrders');
            if (stored) {
                setOrders(JSON.parse(stored));
            }
        }
    };
    loadOrders();
    const handleStorage = (e: StorageEvent) => {
        if (e.key === 'retailOrders') {
            loadOrders();
        }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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
    {order.status && (
        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-blue-600`}>
            {order.status === 'products reached' ? 'Products Reached' : order.status === 'order received' ? 'Order Received' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
    )}
    <Button
        onClick={() => {
            // Update order status to 'order received' in localStorage and state
            const updatedOrders = orders.map(o => o.id === order.id ? { ...o, status: 'order received' } : o);
            setOrders(updatedOrders);
            if (typeof window !== 'undefined') {
                localStorage.setItem('retailOrders', JSON.stringify(updatedOrders));
            }
        }}
        className="ml-2 px-4 py-2 text-white rounded-md transition-colors bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
    >
        Receive
    </Button>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DistributorDashboard() {
    const [isVisible, setIsVisible] = useState(true);

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
            { id: 1001, customer: 'Restaurant A', product: 'Cooking Oil', quantity: 10, status: 'shipped' },
            { id: 1002, customer: 'Hotel B', product: 'Shampoo', quantity: 5, status: 'processing' },
            { id: 1003, customer: 'Catering C', product: 'Soft Margarine', quantity: 8, status: 'pending' },
            { id: 1004, customer: 'Bakery D', product: 'Cooking Oil', quantity: 15, status: 'shipped' }
        ],
        distribution: {
            byProduct: {
                labels: products.map(product => product.name),
                data: [45, 30, 25] // Distribution percentages for the 3 products
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

    // Stock state for each product
    const [stock, setStock] = useState({
        cookingOil: 450,
        shampoo: 280,
        margarine: 320,
    });
    const [inputStock, setInputStock] = useState({
        cookingOil: '',
        shampoo: '',
        margarine: '',
    });
    const [generalStock, setGeneralStock] = useState({
        cookingOil: '',
        shampoo: '',
        margarine: '',
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputStock(prev => ({ ...prev, [name]: value.replace(/\D/, '') }));
    };
    const handleGeneralStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGeneralStock(prev => ({ ...prev, [name]: value.replace(/\D/, '') }));
    };
    const handleUpdateStock = () => {
        setStock(prev => ({
            cookingOil: inputStock.cookingOil ? prev.cookingOil + parseInt(inputStock.cookingOil) : prev.cookingOil,
            shampoo: inputStock.shampoo ? prev.shampoo + parseInt(inputStock.shampoo) : prev.shampoo,
            margarine: inputStock.margarine ? prev.margarine + parseInt(inputStock.margarine) : prev.margarine,
        }));
        setInputStock({ cookingOil: '', shampoo: '', margarine: '' });
    };
    const handleSetGeneralStock = () => {
        setStock(prev => ({
            cookingOil: generalStock.cookingOil ? parseInt(generalStock.cookingOil) : prev.cookingOil,
            shampoo: generalStock.shampoo ? parseInt(generalStock.shampoo) : prev.shampoo,
            margarine: generalStock.margarine ? parseInt(generalStock.margarine) : prev.margarine,
        }));
        setGeneralStock({ cookingOil: '', shampoo: '', margarine: '' });
    };

    // Calculate number of products with stock running low
    const runningLowCount = [stock.cookingOil, stock.shampoo, stock.margarine].filter(v => v > 0 && v <= 400).length;

    // Calculate daily, weekly, and monthly sales from retail orders in Ugx
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('retailOrders');
        if (stored) {
          try {
            const orders = JSON.parse(stored);
            if (Array.isArray(orders)) {
              const now = new Date();
              const today = now.toISOString().split('T')[0];
              const month = now.toISOString().slice(0, 7); // 'YYYY-MM'
              // Calculate start of week (Monday)
              const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // Sunday=0, so treat as 7
              const monday = new Date(now);
              monday.setDate(now.getDate() - (dayOfWeek - 1));
              monday.setHours(0, 0, 0, 0);
              // End of week is today (unless it's Sunday, then it's the full week)
              const weekEnd = new Date(now);
              // Weekly sales: orders with date between monday and weekEnd (inclusive)
              const weekSales = orders
                .filter((order: any) => {
                  if (!order.date) return false;
                  const orderDate = new Date(order.date);
                  return orderDate >= monday && orderDate <= weekEnd;
                })
                .reduce((sum: number, order: any) => sum + (order.discountedTotal || 0), 0);
              const todaySales = orders
                .filter((order: any) => order.date && order.date.startsWith(today))
                .reduce((sum: number, order: any) => sum + (order.discountedTotal || 0), 0);
              const monthSales = orders
                .filter((order: any) => order.date && order.date.startsWith(month))
                .reduce((sum: number, order: any) => sum + (order.discountedTotal || 0), 0);
              setDashboardData(prev => ({
                ...prev,
                sales: {
                  ...prev.sales,
                  daily: todaySales,
                  weekly: weekSales,
                  monthly: monthSales
                }
              }));
            }
          } catch {}
        }
      }
    }, []);

    const [distributorOrders, setDistributorOrders] = useState<any[]>(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('distributorOrders');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed.reverse() : [];
          } catch {
            return [];
          }
        }
      }
      return [];
    });

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

                            <div className="space-y-8">

                                {/* Sales Summary Cards */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                                    <FiPocket className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Daily Sales</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">Ugx {dashboardData.sales.daily.toLocaleString()}</div>
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
                                                    <FiPocket className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Weekly Sales</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">Ugx {dashboardData.sales.weekly.toLocaleString()}</div>
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
                                                    <FiAlertCircle className="h-6 w-6 text-purple-600" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Critical Stock</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">{runningLowCount}</div>
                                                            <span className="ml-2 text-sm text-gray-500">products running low</span>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                            </div>
                                        </div>

                                {/* Available Stock Cards */}
                                {/* Total and product stock cards in a single row */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-4">
                                    {/* Total Packs Card */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg px-8 py-4 flex flex-col items-center shadow">
                                        <span className="text-lg font-semibold text-gray-700 mb-1">Total</span>
                                        <span className="text-3xl font-bold text-green-700 mb-1">{stock.cookingOil + stock.shampoo + stock.margarine}</span>
                                        <span className="text-lg font-semibold text-gray-700">packs</span>
                                    </div>
                                    {/* Cooking Oil Card */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col items-center py-6">
                                        <img src={products[0].image} alt="Cooking Oil" className="h-12 w-12 rounded-md object-cover mb-2" />
                                        <span className="text-md font-semibold text-gray-700">Cooking Oil</span>
                                        <span className="text-2xl font-bold text-gray-900">{stock.cookingOil} jerrycans</span>
                                        {stock.cookingOil > 400 ? (
                                            <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sufficient Stock</span>
                                        ) : stock.cookingOil > 0 ? (
                                            <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Stock Running Low</span>
                                        ) : (
                                            <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>
                                        )}
                                    </div>
                                    {/* Shampoo Card */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col items-center py-6">
                                        <img src={products[1].image} alt="Shampoo" className="h-12 w-12 rounded-md object-cover mb-2" />
                                        <span className="text-md font-semibold text-gray-700">Shampoo</span>
                                        <span className="text-2xl font-bold text-gray-900">{stock.shampoo} bottles</span>
                                        {stock.shampoo > 400 ? (
                                            <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sufficient Stock</span>
                                        ) : stock.shampoo > 0 ? (
                                            <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Stock Running Low</span>
                                        ) : (
                                            <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>
                                        )}
                                    </div>
                                    {/* Soft Margarine Card */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col items-center py-6">
                                        <img src={products[2].image} alt="Soft Margarine" className="h-12 w-12 rounded-md object-cover mb-2" />
                                        <span className="text-md font-semibold text-gray-700">Soft Margarine</span>
                                        <span className="text-2xl font-bold text-gray-900">{stock.margarine} containers</span>
                                        {stock.margarine > 400 ? (
                                            <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sufficient Stock</span>
                                        ) : stock.margarine > 0 ? (
                                            <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Stock Running Low</span>
                                        ) : (
                                            <span className="mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>
                                        )}
                                        </div>
                                    </div>

                                {/* Update Stock Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Card 1: Received today from Factory */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Update Stock</h3>
                                            <p className="mt-1 text-sm text-gray-500">Received today from Factory</p>
                                                </div>
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                <div>
                                                    <label htmlFor="cookingOil" className="block text-sm font-medium text-gray-700 mb-1">Cooking Oil</label>
                                                    <input
                                                        type="number"
                                                        name="cookingOil"
                                                        id="cookingOil"
                                                        value={inputStock.cookingOil}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                                                        placeholder="Units received"
                                                        min="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="shampoo" className="block text-sm font-medium text-gray-700 mb-1">Shampoo</label>
                                                    <input
                                                        type="number"
                                                        name="shampoo"
                                                        id="shampoo"
                                                        value={inputStock.shampoo}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                        placeholder="Units received"
                                                        min="0"
                                                    />
                                            </div>
                                                <div>
                                                    <label htmlFor="margarine" className="block text-sm font-medium text-gray-700 mb-1">Soft Margarine</label>
                                                    <input
                                                        type="number"
                                                        name="margarine"
                                                        id="margarine"
                                                        value={inputStock.margarine}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        placeholder="Units received"
                                                        min="0"
                                                    />
                                        </div>
                                            </div>
                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    onClick={handleUpdateStock}
                                                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                                >
                                                    Update
                                                </button>
                                        </div>
                                    </div>
                                </div>
                                    {/* Card 2: Update the general stock */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Update Stock</h3>
                                            <p className="mt-1 text-sm text-gray-500 font-semibold">Update the general stock</p>
                                        </div>
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                <div>
                                                    <label htmlFor="general-cookingOil" className="block text-sm font-medium text-gray-700 mb-1">Cooking Oil</label>
                                                    <input
                                                        type="number"
                                                        name="cookingOil"
                                                        id="general-cookingOil"
                                                        value={generalStock.cookingOil}
                                                        onChange={handleGeneralStockChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                                                        placeholder="Set new value"
                                                        min="0"
                                                    />
                                                                </div>
                                                <div>
                                                    <label htmlFor="general-shampoo" className="block text-sm font-medium text-gray-700 mb-1">Shampoo</label>
                                                    <input
                                                        type="number"
                                                        name="shampoo"
                                                        id="general-shampoo"
                                                        value={generalStock.shampoo}
                                                        onChange={handleGeneralStockChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                        placeholder="Set new value"
                                                        min="0"
                                                    />
                                                            </div>
                                                <div>
                                                    <label htmlFor="general-margarine" className="block text-sm font-medium text-gray-700 mb-1">Soft Margarine</label>
                                                    <input
                                                        type="number"
                                                        name="margarine"
                                                        id="general-margarine"
                                                        value={generalStock.margarine}
                                                        onChange={handleGeneralStockChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        placeholder="Set new value"
                                                        min="0"
                                                    />
                                                            </div>
                                                        </div>
                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    onClick={handleSetGeneralStock}
                                                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Set Stock
                                                </button>
                                        </div>
                                            </div>
                                        </div>
                                    </div>
                                {/* Place Distributor Order Card */}
                                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Place Distributor Order</h3>
                                        <p className="mt-1 text-sm text-gray-500">Order products for distribution. 35% discount applies for quantities greater than 1.</p>
                                    </div>
                                    <DistributorOrderCard distributorOrders={distributorOrders} setDistributorOrders={setDistributorOrders} />
                                </div>
                                {/* Distributor's Order History Card */}
                                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Distributor's Order History</h3>
                                        <p className="mt-1 text-sm text-gray-500">All distributor orders placed are shown below.</p>
                                    </div>
                                    <DistributorOrderHistory distributorOrders={distributorOrders} />
                                    </div>

                                {/* Available Orders */}
                            <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Available Orders</h3>
                                    <p className="mt-1 text-sm text-gray-500">All retail orders placed and available for processing</p>
                                        </div>
                                        <div className="px-4 py-5 sm:p-6">
                                    <RetailOrderHistory />
                                            </div>
                            </div>
                                    
                                    {/* Inventory Table */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2 mt-6">Current Stock</h3>
                                <div className="bg-white shadow rounded-lg overflow-hidden">
                                    <div className="px-4 py-5 sm:p-6">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {products.map((product) => {
                                                    let stockValue = 0;
                                                    let unit = product.unit || 'units';
                                                    if (product.name.toLowerCase().includes('oil')) stockValue = stock.cookingOil;
                                                    else if (product.name.toLowerCase().includes('shampoo')) stockValue = stock.shampoo;
                                                    else if (product.name.toLowerCase().includes('margarine')) stockValue = stock.margarine;
                                                    else stockValue = 0;
                                                    let statusLabel = '';
                                                    let statusClass = '';
                                                    if (stockValue > 400) {
                                                        statusLabel = 'Sufficient Stock';
                                                        statusClass = 'bg-green-100 text-green-800';
                                                    } else if (stockValue > 0) {
                                                        statusLabel = 'Stock Running Low';
                                                        statusClass = 'bg-orange-100 text-orange-800';
                                                    } else {
                                                        statusLabel = 'Out of Stock';
                                                        statusClass = 'bg-red-100 text-red-800';
                                                    }
                                                    return (
                                                        <tr key={product.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover mr-4" />
                                                                    <div className="ml-1">
                                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stockValue} {unit}{stockValue === 1 ? '' : 's'}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>{statusLabel}</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Distribution Graphs */}
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    {/* Product Distribution Pie Chart */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Current Stock Distribution</h3>
                                            <p className="mt-1 text-sm text-gray-500">Breakdown of current stock for each product</p>
                                        </div>
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="h-80">
                                                <Pie 
                                                    data={{
                                                        labels: ['Cooking Oil', 'Shampoo', 'Soft Margarine'],
                                                        datasets: [
                                                            {
                                                                data: [stock.cookingOil, stock.shampoo, stock.margarine],
                                                                backgroundColor: [
                                                                    'rgba(234, 179, 8, 0.7)',  // yellow-500 for Cooking Oil
                                                                    'rgba(16, 185, 129, 0.7)',  // green-500 for Shampoo
                                                                    'rgba(59, 130, 246, 0.7)'   // blue-500 for Soft Margarine
                                                                ],
                                                                borderColor: [
                                                                    'rgba(234, 179, 8, 1)',
                                                                    'rgba(16, 185, 129, 1)',
                                                                    'rgba(59, 130, 246, 1)'
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
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Stock by Status</h3>
                                            <p className="mt-1 text-sm text-gray-500">Number of products in each stock status</p>
                                        </div>
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="h-80">
                                                {(() => {
                                                    // Define thresholds
                                                    const thresholds = {
                                                        cookingOil: 400,
                                                        shampoo: 400,
                                                        margarine: 400,
                                                    };
                                                    // Determine status for each product
                                                    const statusCounts = { 'In Stock': 0, 'Low Stock': 0, 'Out of Stock': 0 };
                                                    const products = [
                                                        { name: 'Cooking Oil', value: stock.cookingOil, threshold: thresholds.cookingOil },
                                                        { name: 'Shampoo', value: stock.shampoo, threshold: thresholds.shampoo },
                                                        { name: 'Soft Margarine', value: stock.margarine, threshold: thresholds.margarine },
                                                    ];
                                                    products.forEach(p => {
                                                        if (p.value === 0) statusCounts['Out of Stock']++;
                                                        else if (p.value <= p.threshold) statusCounts['Low Stock']++;
                                                        else statusCounts['In Stock']++;
                                                    });
                                                    return (
                                                <Bar
                                                    data={{
                                                                labels: ['In Stock', 'Low Stock', 'Out of Stock'],
                                                        datasets: [
                                                            {
                                                                        label: 'Number of Products',
                                                                        data: [statusCounts['In Stock'], statusCounts['Low Stock'], statusCounts['Out of Stock']],
                                                                        backgroundColor: [
                                                                            'rgba(16, 185, 129, 0.7)', // green
                                                                            'rgba(234, 179, 8, 0.7)', // yellow
                                                                            'rgba(239, 68, 68, 0.7)', // red
                                                                        ],
                                                                        borderColor: [
                                                                            'rgba(16, 185, 129, 1)',
                                                                            'rgba(234, 179, 8, 1)',
                                                                            'rgba(239, 68, 68, 1)',
                                                                        ],
                                                                borderWidth: 1,
                                                            },
                                                        ],
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                                    legend: { display: false },
                                                            tooltip: {
                                                                callbacks: {
                                                                    label: function(context) {
                                                                                return `${context.label}: ${context.raw} products`;
                                                                    }
                                                                }
                                                            }
                                                                },
                                                                scales: {
                                                                    y: { beginAtZero: true }
                                                        }
                                                    }}
                                                />
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Products Grid */}
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Available Products</h3>
                                        <p className="mt-1 text-sm text-gray-500">Our complete product catalog</p>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                            {products.map(product => (
                                                <div key={product.id} className="flex flex-col items-center rounded-lg bg-pink-100 p-6 shadow-lg dark:bg-pink-900">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="mb-4 h-48 w-full rounded-md object-cover"
                                                    />
                                                    <h3 className="text-xl font-semibold text-center">{product.name}</h3>
                                                    <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
                                                        {product.description}
                                                    </p>
                                                    <p className="mt-4 text-lg font-bold text-green-600">
                                                        Ugx {product.price.toLocaleString()}
                                                    </p>
                                        </div>
                                            ))}
                                    </div>
                                                            </div>
                                                            </div>
                            <RetailOrderHistory />
                                                        </div>
                                                            </div>
                                                            </div>
                                                        </div>
        </AppLayout>
    );
}

function DistributorOrderCard({ distributorOrders, setDistributorOrders }: { distributorOrders: any[], setDistributorOrders: (orders: any[]) => void }) {
  const [quantities, setQuantities] = useState({
    cookingOil: 0,
    shampoo: 0,
    margarine: 0,
  });
  const [total, setTotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [success, setSuccess] = useState(false);

  // Example prices (replace with real prices if available)
  const prices = {
    cookingOil: 25000,
    shampoo: 12000,
    margarine: 18000,
  };

  useEffect(() => {
    let sum = 0;
    let discounted = 0;
    Object.entries(quantities).forEach(([key, qty]) => {
      const price = prices[key as keyof typeof prices];
      const q = Number(qty);
      if (q > 1) {
        discounted += q * price * 0.65; // 35% discount
      } else {
        discounted += q * price;
      }
      sum += q * price;
    });
    setTotal(sum);
    setDiscountedTotal(discounted);
  }, [quantities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuantities(prev => ({ ...prev, [name]: Math.max(0, Number(value)) }));
  };

  const handlePlaceOrder = () => {
    // Save order to localStorage (simulate backend)
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [
        { name: 'Cooking Oil', quantity: quantities.cookingOil, price: prices.cookingOil, discountApplied: quantities.cookingOil > 1 },
        { name: 'Shampoo', quantity: quantities.shampoo, price: prices.shampoo, discountApplied: quantities.shampoo > 1 },
        { name: 'Soft Margarine', quantity: quantities.margarine, price: prices.margarine, discountApplied: quantities.margarine > 1 },
      ].filter(item => item.quantity > 0),
      total,
      discountedTotal,
      status: 'placed',
    };
    if (order.items.length === 0) return;
    let newOrders = [order, ...distributorOrders];
    setDistributorOrders(newOrders);
    if (typeof window !== 'undefined') {
      localStorage.setItem('distributorOrders', JSON.stringify([...newOrders].reverse()));
    }
    setQuantities({ cookingOil: 0, shampoo: 0, margarine: 0 });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
                                <div className="px-4 py-5 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
          <label htmlFor="cookingOil" className="block text-sm font-medium text-gray-700 mb-1">Cooking Oil</label>
          <input
            type="number"
            name="cookingOil"
            id="order-cookingOil"
            value={quantities.cookingOil}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm text-right"
            min="0"
          />
                                        </div>
        <div>
          <label htmlFor="shampoo" className="block text-sm font-medium text-gray-700 mb-1">Shampoo</label>
          <input
            type="number"
            name="shampoo"
            id="order-shampoo"
            value={quantities.shampoo}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-right"
            min="0"
          />
                                    </div>
        <div>
          <label htmlFor="margarine" className="block text-sm font-medium text-gray-700 mb-1">Soft Margarine</label>
          <input
            type="number"
            name="margarine"
            id="order-margarine"
            value={quantities.margarine}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-right"
            min="0"
          />
                                                    </div>
                                                    </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="text-lg font-semibold text-gray-700">Total: <span className="text-gray-900 font-bold">Ugx {total.toLocaleString()}</span></div>
        <div className="text-lg font-semibold text-green-700">Discounted Total: <span className="text-green-900 font-bold">Ugx {discountedTotal.toLocaleString()}</span></div>
                                                </div>
      <div className="flex justify-end">
        <Button onClick={handlePlaceOrder} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md font-semibold">Place Order</Button>
                                            </div>
      {success && <div className="mt-4 text-green-600 font-semibold">Order placed successfully!</div>}
                                        </div>
  );
}

function DistributorOrderHistory({ distributorOrders }: { distributorOrders: any[] }) {
  const [orders, setOrders] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('distributorOrders');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed.reverse() : [];
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  if (orders.length === 0) {
    return <div className="px-8 py-6 text-gray-500">No distributor orders found.</div>;
  }
  return (
    <div className="px-8 py-6 w-full">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discounted Total</th>
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
                      <li key={idx}>{item.name} x {item.quantity} @ Ugx {item.price.toLocaleString()} {item.discountApplied && <span className="text-green-600">(35% off)</span>}</li>
                    ))}
                  </ul>
                                                        </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ugx {order.total ? Number(order.total).toLocaleString() : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">Ugx {order.discountedTotal ? Number(order.discountedTotal).toLocaleString() : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
    {order.status && (
        <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-blue-600">
            {order.status === 'products reached' ? 'Products Reached' : order.status === 'order received' ? 'Order Received' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
    )}
    <Button
        onClick={() => {
            // Update order status to 'products reached' in localStorage and state
            const updatedOrders = orders.map(o => o.id === order.id ? { ...o, status: 'products reached' } : o);
            setOrders(updatedOrders);
            if (typeof window !== 'undefined') {
                localStorage.setItem('distributorOrders', JSON.stringify(updatedOrders));
            }
        }}
        className="ml-2 px-4 py-2 text-white rounded-md transition-colors bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
    >
        Receive
    </Button>
</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
    );
}