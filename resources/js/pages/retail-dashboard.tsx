import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface Product {
  id: number;
  name: string;
  category: 'palm-oil' | 'shampoo' | 'margarine';
  stock: number;
  threshold: number;
  price: number;
  description?: string;
}

interface Order {
  id: number;
  customer: string;
  product: string;
  quantity: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  date: string;
  amount: number;
}

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  isCustomer?: boolean;
}

export default function RetailDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [inventory, setInventory] = useState<Product[]>([
    // Palm Oil Products
    { id: 1, name: 'Premium Palm Oil (20L)', category: 'palm-oil', stock: 150, threshold: 20, price: 12.99, description: 'High quality refined palm oil for cooking' },
    { id: 2, name: 'Organic Palm Oil (500ml)', category: 'palm-oil', stock: 80, threshold: 15, price: 8.99, description: 'Organic certified palm oil' },
    { id: 3, name: 'Bulk Palm Oil (5L)', category: 'palm-oil', stock: 45, threshold: 5, price: 45.99, description: 'Economy size for commercial kitchens' },
    { id: 4, name: 'Palm Oil Blend (1L)', category: 'palm-oil', stock: 120, threshold: 25, price: 10.99, description: 'Blended with other vegetable oils' },
    
    // Shampoo Products
    { id: 5, name: 'Palm Oil Shampoo (300ml)', category: 'shampoo', stock: 90, threshold: 30, price: 7.99, description: 'Moisturizing shampoo with palm oil extracts' },
    { id: 6, name: 'Anti-Dandruff Shampoo (250ml)', category: 'shampoo', stock: 75, threshold: 25, price: 9.99, description: 'With palm-derived surfactants' },
    { id: 7, name: 'Volume Boost Shampoo (400ml)', category: 'shampoo', stock: 60, threshold: 20, price: 11.99, description: 'Palm oil based formula for fuller hair' },
    
    // Margarine Products
    { id: 8, name: 'Palm-Based Margarine (500g)', category: 'margarine', stock: 110, threshold: 40, price: 4.99, description: 'Perfect for baking and spreading' },
    { id: 9, name: 'Low-Fat Margarine (250g)', category: 'margarine', stock: 85, threshold: 30, price: 3.99, description: 'Reduced fat palm oil margarine' },
    { id: 10, name: 'Premium Baking Margarine (1kg)', category: 'margarine', stock: 50, threshold: 15, price: 8.99, description: 'Professional grade for pastry chefs' },
  ]);
  
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, customer: 'Restaurant A', product: 'Bulk Palm Oil (5L)', quantity: 10, status: 'Completed', date: '2023-06-01', amount: 459.90 },
    { id: 2, customer: 'Catering B', product: 'Premium Palm Oil (1L)', quantity: 25, status: 'Completed', date: '2023-06-05', amount: 324.75 },
    { id: 3, customer: 'Hotel C', product: 'Organic Palm Oil (500ml)', quantity: 15, status: 'Completed', date: '2023-06-08', amount: 134.85 },
    { id: 4, customer: 'Salon D', product: 'Palm Oil Shampoo (300ml)', quantity: 20, status: 'Completed', date: '2023-06-10', amount: 159.80 },
    { id: 5, customer: 'Bakery E', product: 'Premium Baking Margarine (1kg)', quantity: 8, status: 'Completed', date: '2023-06-12', amount: 71.92 },
    { id: 6, customer: 'Restaurant F', product: 'Bulk Palm Oil (5L)', quantity: 5, status: 'Processing', date: '2023-06-15', amount: 229.95 },
    { id: 7, customer: 'Cafe G', product: 'Palm Oil Blend (1L)', quantity: 12, status: 'Pending', date: '2023-06-16', amount: 131.88 },
  ]);
  
  const [distributorMessages, setDistributorMessages] = useState<Message[]>([
    { id: 1, sender: 'Distributor X', message: 'Your order will be shipped tomorrow', time: '10:30 AM' },
    { id: 2, sender: 'You', message: 'Thanks for the update', time: '10:35 AM' },
  ]);
  
  const [customerMessages, setCustomerMessages] = useState<Message[]>([
    { id: 1, sender: 'Restaurant A', message: 'When will my order arrive?', time: '9:15 AM', isCustomer: true },
    { id: 2, sender: 'You', message: 'It should arrive by tomorrow afternoon', time: '9:20 AM' },
    { id: 3, sender: 'Salon D', message: 'Do you have more shampoo in stock?', time: '11:45 AM', isCustomer: true },
  ]);
  
  const [newDistributorMessage, setNewDistributorMessage] = useState('');
  const [newCustomerMessage, setNewCustomerMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | Product['category']>('all');
  const [activeChat, setActiveChat] = useState<'distributor' | 'customer'>('distributor');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWelcomeVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateStock = (id: number, newStock: number) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, stock: newStock } : item
    ));
  };

  const handleUpdateOrderStatus = (id: number, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const handleSendDistributorMessage = () => {
    if (newDistributorMessage.trim()) {
      const newMsg = {
        id: distributorMessages.length + 1,
        sender: 'You',
        message: newDistributorMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setDistributorMessages([...distributorMessages, newMsg]);
      setNewDistributorMessage('');
    }
  };

  const handleSendCustomerMessage = () => {
    if (newCustomerMessage.trim() && selectedCustomer) {
      const newMsg = {
        id: customerMessages.length + 1,
        sender: 'You',
        message: newCustomerMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCustomerMessages([...customerMessages, {
        id: customerMessages.length + 2,
        sender: selectedCustomer,
        message: `Response to: ${newCustomerMessage}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCustomer: true
      }, newMsg]);
      setNewCustomerMessage('');
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const filteredInventory = categoryFilter === 'all' 
    ? inventory 
    : inventory.filter(product => product.category === categoryFilter);

  const filteredProducts = categoryFilter === 'all' 
    ? inventory 
    : inventory.filter(product => product.category === categoryFilter);

  const getCategoryColor = (category: Product['category']) => {
    switch(category) {
      case 'palm-oil': return 'bg-orange-100 text-orange-800';
      case 'shampoo': return 'bg-blue-100 text-blue-800';
      case 'margarine': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Prepare sales data for the chart
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Palm Oil Sales',
        data: [1200, 1900, 1500, 2100, 1800, 2400],
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.5)',
      },
      {
        label: 'Shampoo Sales',
        data: [800, 1200, 1000, 1500, 1300, 1800],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Margarine Sales',
        data: [600, 900, 750, 1100, 950, 1300],
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Sales Performance',
      },
    },
  };

  // Calculate total sales
  const totalSales = orders
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + order.amount, 0);

  // Calculate pending orders value
  const pendingOrdersValue = orders
    .filter(order => order.status === 'Pending')
    .reduce((sum, order) => sum + order.amount, 0);

  // Get unique customers for chat selection
  const uniqueCustomers = [...new Set(orders.map(order => order.customer))];

  return (
    <AppLayout>
      <Head title="Retail Dashboard - Palm Oil Products Management" />

      <div className="py-6">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {isWelcomeVisible && (
            <div className="p-4 mb-6 text-white bg-green-600 rounded-lg shadow-sm">
              Welcome back to your Palm Oil Products Retail Dashboard!
            </div>
          )}

          <div className="mb-6">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-t-lg ${activeTab === 'dashboard' ? 'bg-white text-green-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-t-lg ${activeTab === 'inventory' ? 'bg-white text-green-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-t-lg ${activeTab === 'orders' ? 'bg-white text-green-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-t-lg ${activeTab === 'products' ? 'bg-white text-green-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-t-lg ${activeTab === 'chat' ? 'bg-white text-green-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
              >
                Communications
              </button>
            </nav>
          </div>

          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            {activeTab === 'dashboard' && (
              <div className="p-6">
                <h2 className="mb-6 text-xl font-semibold">Sales Dashboard</h2>
                
                {/* Sales Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                    <p className="mt-1 text-2xl font-semibold">${totalSales.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-green-600">+12% from last month</p>
                  </div>
                  <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
                    <p className="mt-1 text-2xl font-semibold">{orders.filter(o => o.status === 'Completed').length}</p>
                    <p className="mt-1 text-sm text-green-600">+5 from last month</p>
                  </div>
                  <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
                    <p className="mt-1 text-2xl font-semibold">${pendingOrdersValue.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-yellow-600">Waiting for processing</p>
                  </div>
                </div>

                {/* Sales Chart */}
                <div className="p-4 mb-6 bg-white border rounded-lg shadow-sm">
                  <Line options={salesOptions} data={salesData} />
                </div>

                {/* Recent Orders */}
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <h3 className="mb-4 text-lg font-medium">Recent Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{order.product}</td>
                            <td className="px-6 py-4 whitespace-nowrap">${order.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Inventory Management</h2>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as 'all' | Product['category'])}
                    className="border-gray-300 rounded-md shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  >
                    <option value="all">All Categories</option>
                    <option value="palm-oil">Palm Oil</option>
                    <option value="shampoo">Shampoo</option>
                    <option value="margarine">Margarine</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Threshold</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInventory.map((item) => (
                        <tr key={item.id} className={item.stock <= item.threshold ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                              {item.category.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.stock} units</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.threshold} units</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.stock <= item.threshold ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Low Stock
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                In Stock
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => {
                                const newStock = prompt(`Enter new stock quantity for ${item.name}`, String(item.stock));
                                if (newStock !== null && !isNaN(Number(newStock))) {
                                  handleUpdateStock(item.id, parseInt(newStock));
                                }
                              }}
                              className="text-green-600 hover:text-green-900 mr-2"
                            >
                              Update
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              Reorder
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Customer Orders</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{order.product}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${order.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="border-gray-300 rounded-md shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    + Create New Order
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Product Catalog</h2>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as 'all' | Product['category'])}
                    className="border-gray-300 rounded-md shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  >
                    <option value="all">All Categories</option>
                    <option value="palm-oil">Palm Oil</option>
                    <option value="shampoo">Shampoo</option>
                    <option value="margarine">Margarine</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className={`h-48 flex items-center justify-center ${
                        product.category === 'palm-oil' ? 'bg-orange-50' :
                        product.category === 'shampoo' ? 'bg-blue-50' :
                        'bg-yellow-50'
                      }`}>
                        {product.category === 'palm-oil' && (
                          <span className="text-orange-400">Palm Oil Bottle</span>
                        )}
                        {product.category === 'shampoo' && (
                          <span className="text-blue-400">Shampoo Bottle</span>
                        )}
                        {product.category === 'margarine' && (
                          <span className="text-yellow-600">Margarine Tub</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg">{product.name}</h3>
                          <span className={`px-2 text-xs leading-5 font-semibold rounded-full ${getCategoryColor(product.category)}`}>
                            {product.category.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">Current Stock: {product.stock} units</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-green-600 font-medium">${product.price.toFixed(2)}</span>
                          <button
                            onClick={() => handleViewDetails(product)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Communications</h2>
                
                <div className="flex mb-4 space-x-2">
                  <button
                    onClick={() => setActiveChat('distributor')}
                    className={`px-4 py-2 rounded-md ${activeChat === 'distributor' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Distributor Chat
                  </button>
                  <button
                    onClick={() => setActiveChat('customer')}
                    className={`px-4 py-2 rounded-md ${activeChat === 'customer' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Customer Support
                  </button>
                </div>

                {activeChat === 'distributor' ? (
                  <div className="border rounded-lg h-96 flex flex-col">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="font-medium">Chat with Distributor X</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {distributorMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === 'You' ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <p className="font-medium">{msg.sender}</p>
                            <p className="mt-1">{msg.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newDistributorMessage}
                          onChange={(e) => setNewDistributorMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleSendDistributorMessage()}
                        />
                        <button
                          onClick={handleSendDistributorMessage}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <div className="w-1/3 border rounded-lg h-96 flex flex-col">
                      <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-medium">Customers</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {uniqueCustomers.map((customer) => (
                          <div 
                            key={customer} 
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedCustomer === customer ? 'bg-green-50' : ''}`}
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <p className="font-medium">{customer}</p>
                            <p className="text-sm text-gray-500">
                              {customerMessages.filter(m => m.sender === customer).length} messages
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 border rounded-lg h-96 flex flex-col">
                      {selectedCustomer ? (
                        <>
                          <div className="p-4 border-b bg-gray-50">
                            <h3 className="font-medium">Chat with {selectedCustomer}</h3>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {customerMessages
                              .filter(msg => msg.sender === selectedCustomer || (msg.sender === 'You' && msg.message.includes(selectedCustomer)))
                              .map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === 'You' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    <p className="font-medium">{msg.sender}</p>
                                    <p className="mt-1">{msg.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <div className="p-4 border-t">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newCustomerMessage}
                                onChange={(e) => setNewCustomerMessage(e.target.value)}
                                placeholder={`Message to ${selectedCustomer}`}
                                className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendCustomerMessage()}
                              />
                              <button
                                onClick={handleSendCustomerMessage}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                          Select a customer to start chatting
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Product details and information
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="mt-4 space-y-4">
              <div className={`p-4 rounded-lg ${
                selectedProduct.category === 'palm-oil' ? 'bg-orange-50' :
                selectedProduct.category === 'shampoo' ? 'bg-blue-50' :
                'bg-yellow-50'
              }`}>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium capitalize">{selectedProduct.category.replace('-', ' ')}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Current Stock</p>
                  <p className="font-medium">{selectedProduct.stock} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reorder Threshold</p>
                  <p className="font-medium">{selectedProduct.threshold} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">${selectedProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {selectedProduct.stock <= selectedProduct.threshold ? 'Low Stock' : 'In Stock'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1">{selectedProduct.description}</p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => {
                    const newStock = prompt(`Enter new stock quantity for ${selectedProduct.name}`, String(selectedProduct.stock));
                    if (newStock !== null && !isNaN(Number(newStock))) {
                      handleUpdateStock(selectedProduct.id, parseInt(newStock));
                      setSelectedProduct({...selectedProduct, stock: parseInt(newStock)});
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Update Stock
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}