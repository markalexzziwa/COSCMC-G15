import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button } from '@/components/ui/button';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  image:string;
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

function AvailableOrdersCard() {
    type OrderItem = { id: number; name: string; quantity: number; price: number };
    type Order = {
        id: number;
        date: string;
        total: number;
        discountedAmount: number;
        items: OrderItem[];
        status?: string;
    };
    const [orders, setOrders] = useState<Order[]>([])
    
    useEffect(() => {
        const stored = localStorage.getItem('customerOrders');
        if (stored) {
            setOrders(JSON.parse(stored));
        }
    }, []);

    const updateOrderStatus = (orderId: number, status: string) => {
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('customerOrders', JSON.stringify(updatedOrders));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'placed':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'received':
                return 'bg-yellow-500 hover:bg-yellow-600';
            case 'completed':
                return 'bg-green-500 hover:bg-green-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    return (
        <div style={{ backgroundColor: '#F0F7FF' }}>
            {orders.length === 0 ? (
                <div>No orders found.</div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: Order) => (
                        <div key={order.id} className="border-b pb-4">
                            <div className="flex justify-between font-semibold">
                                <span>Order Date:</span>
                                <span>{new Date(order.date).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total:</span>
                                <span>Ugx {Number(order.total).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount Paid:</span>
                                <span>Ugx {Number(order.discountedAmount).toLocaleString()}</span>
                            </div>
                            {order.discountedAmount < order.total && (
                                <div className="flex justify-between text-green-700 font-semibold">
                                    <span>Discounted Amount:</span>
                                    <span>Ugx {Number(order.discountedAmount).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="mt-2">
                                <div className="font-semibold">Products:</div>
                                <ul className="list-disc list-inside">
                                    {order.items.map((item: OrderItem) => (
                                        <li key={item.id}>
                                            {item.name} x {item.quantity} @ Ugx {item.price.toLocaleString()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                                <div className="flex justify-between w-full">
                                    <Button
                                        onClick={() => updateOrderStatus(order.id, 'placed')}
                                        className="px-4 py-2 text-white rounded-md transition-colors bg-green-600 hover:bg-green-700 flex items-center justify-center w-1/3 mx-1"
                                    >
                                        <span className="mr-2">✔</span>Placed
                                    </Button>
                                    <Button
                                        onClick={() => updateOrderStatus(order.id, 'received')}
                                        className="px-4 py-2 text-white rounded-md transition-colors bg-red-600 hover:bg-red-700 flex items-center justify-center w-1/3 mx-1"
                                    >
                                        <span className="mr-2">✗</span>Receive
                                    </Button>
                                    <Button
                                        onClick={() => updateOrderStatus(order.id, 'completed')}
                                        className="px-4 py-2 text-white rounded-md transition-colors bg-red-600 hover:bg-red-700 flex items-center justify-center w-1/3 mx-1"
                                    >
                                        <span className="mr-2">✗</span>Order Complete
                                    </Button>
                                </div>
                                {order.status && (
                                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Place Retail Order Card
function PlaceRetailOrderCard({ inventory, onPlaceOrder }: { inventory: Product[], onPlaceOrder: (order: any) => void }) {
  const [inputs, setInputs] = useState<{ [id: number]: string }>({});
  const [messages, setMessages] = useState<string[]>([]);

  const handleInputChange = (id: number, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  // Calculate totals
  let originalTotal = 0;
  let discountedTotal = 0;
  inventory.forEach(product => {
    const qty = parseInt(inputs[product.id] || '');
    if (!isNaN(qty) && qty > 0) {
      originalTotal += qty * product.price;
      if (qty > 1) {
        discountedTotal += qty * product.price * 0.75;
      } else {
        discountedTotal += qty * product.price;
      }
    }
  });

  const handlePlaceOrder = () => {
    const items = inventory
      .filter(product => {
        const quantity = parseInt(inputs[product.id] || '');
        return !isNaN(quantity) && quantity > 0;
      })
      .map(product => {
        const quantity = parseInt(inputs[product.id]);
        const discountApplied = quantity > 1;
        const price = product.price;
        const discountedPrice = discountApplied ? price * 0.75 : price;
        return {
          id: product.id,
          name: product.name,
          quantity,
          price,
          discountedPrice,
          discountApplied
        };
      });
    if (items.length === 0) {
      setMessages(['Enter a valid quantity for at least one product.']);
      return;
    }
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items,
      status: 'placed',
      originalTotal,
      discountedTotal
    };
    onPlaceOrder(order);
    setMessages(['Order placed successfully.']);
    setInputs({});
  };

  return (
    <div className="bg-white border border-blue-200 rounded-lg px-8 py-6 flex flex-col items-center shadow w-full max-w-2xl mb-8">
      <span className="text-lg font-semibold text-gray-700 mb-4">Place Retail Order</span>
      <div className="flex flex-col gap-6 w-full">
        {inventory.map(product => (
          <div key={product.id} className="flex flex-row items-center gap-4 w-full justify-between">
            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
            <span className="text-md font-semibold text-gray-700 w-32 text-center">{product.name}</span>
            <input
              type="number"
              min="1"
              value={inputs[product.id] || ''}
              onChange={e => handleInputChange(product.id, e.target.value)}
              placeholder="Quantity"
              className="border rounded-md px-3 py-2 text-gray-700 w-32"
            />
          </div>
        ))}
      </div>
      {/* Total Price Display */}
      <div className="w-full flex flex-col items-end mt-6">
        <span className="text-md text-gray-700">Original Total: <span className="font-semibold">Ugx {originalTotal.toLocaleString()}</span></span>
        <span className="text-lg font-bold text-blue-700">Discounted Total: Ugx {discountedTotal.toLocaleString()}</span>
        {discountedTotal < originalTotal && (
          <span className="text-green-600 font-medium">25% discount applied for products with quantity &gt; 1</span>
        )}
      </div>
      <Button onClick={handlePlaceOrder} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md mt-4">Place Order</Button>
      {messages.length > 0 && (
        <div className="mt-4 space-y-1">
          {messages.map((msg, idx) => (
            <div key={idx} className="text-blue-700 font-medium">{msg}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// Update RetailerOrderHistoryCard to show both totals and discount info
function RetailerOrderHistoryCard({ orders, setOrders }: { orders: any[], setOrders: React.Dispatch<React.SetStateAction<any[]>> }) {
  const updateOrderStatus = (orderId: number, status: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    if (typeof window !== 'undefined') {
      localStorage.setItem('retailOrders', JSON.stringify(updatedOrders));
    }
  };

  const clearHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('retailOrders');
    }
    setOrders([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'received':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="px-8 py-6 flex flex-col items-center w-full mb-8 relative">
      <span className="text-lg font-semibold text-gray-700 mb-4">Retail Order History</span>
      <button
        onClick={clearHistory}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-700 text-white text-xs px-3 py-1 rounded focus:outline-none"
      >
        Clear History
      </button>
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

// Retailer Edit Stock Card
function RetailerEditStockCard({ inventory, setInventory }: { inventory: Product[], setInventory: React.Dispatch<React.SetStateAction<Product[]>> }) {
  const [inputs, setInputs] = useState<{ [id: number]: string }>({});
  const [messages, setMessages] = useState<string[]>([]);

  const handleInputChange = (id: number, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleSetStock = () => {
    const newMessages: string[] = [];
    let anySet = false;
    setInventory(prev => prev.map(product => {
      const stockValue = parseInt(inputs[product.id] || '');
      if (!isNaN(stockValue) && stockValue >= 0) {
        newMessages.push(`Stock updated for ${product.name}.`);
        anySet = true;
        return { ...product, stock: stockValue };
      }
      return product;
    }));
    setMessages(anySet ? newMessages : ['Enter a valid stock value for at least one product.']);
    // Clear only the inputs for which stock was set
    setInputs(prev => {
      const updated = { ...prev };
      inventory.forEach(product => {
        const stockValue = parseInt(prev[product.id] || '');
        if (!isNaN(stockValue) && stockValue >= 0) {
          updated[product.id] = '';
        }
      });
      return updated;
    });
  };

  return (
    <div className="bg-white border border-green-200 rounded-lg px-8 py-6 flex flex-col items-center shadow w-full max-w-2xl mb-8">
      <span className="text-lg font-semibold text-gray-700 mb-4">Edit Product Stock</span>
      <div className="flex flex-col gap-6 w-full">
        {inventory.map(product => (
          <div key={product.id} className="flex flex-row items-center gap-4 w-full justify-between">
            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
            <span className="text-md font-semibold text-gray-700 w-32 text-center">{product.name}</span>
            <input
              type="number"
              min="0"
              value={inputs[product.id] || ''}
              onChange={e => handleInputChange(product.id, e.target.value)}
              placeholder="New stock value"
              className="border rounded-md px-3 py-2 text-gray-700 w-32"
            />
          </div>
        ))}
      </div>
      <Button onClick={handleSetStock} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md mt-6">Set Stock</Button>
      {messages.length > 0 && (
        <div className="mt-4 space-y-1">
          {messages.map((msg, idx) => (
            <div key={idx} className="text-green-700 font-medium">{msg}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add Stock Status Table Card component
function StockStatusTableCard({ inventory }: { inventory: Product[] }) {
  const getStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-600 text-white' };
    if (stock <= threshold) return { label: 'Low Stock', color: 'bg-yellow-500 text-white' };
    return { label: 'In Stock', color: 'bg-green-600 text-white' };
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
            {inventory.map(product => {
              const status = getStatus(product.stock, product.threshold);
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

function DailyWeeklySalesCards() {
  const [daily, setDaily] = useState(0);
  const [weekly, setWeekly] = useState(0);

  useEffect(() => {
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

export default function RetailDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [inventory, setInventory] = useState<Product[]>([
    { id: 1, name: 'Cooking Oil', category: 'palm-oil', stock: 150, threshold: 20, price: 32400, description: 'High-quality cooking oil, perfect for all your culinary needs.', image: '/cooking oil.jpg' },
    { id: 2, name: 'Shampoo', category: 'shampoo', stock: 90, threshold: 30, price: 4700, description: 'Invigorating shampoo that leaves your hair fresh and clean.', image: '/shampoo.jpg' },
    { id: 3, name: 'Soft Margarine', category: 'margarine', stock: 110, threshold: 40, price: 6000, description: 'Smooth and creamy margarine, a perfect spread.', image: '/soft magarine.jpg' },
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

  const [retailOrders, setRetailOrders] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('retailOrders');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWelcomeVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('retailStock');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setInventory(parsed);
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('retailStock', JSON.stringify(inventory));
    }
  }, [inventory]);

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

  // Card at the top showing number of available customer orders
  const availableCustomerOrdersCount = (() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('customerOrders') : null;
    if (stored) {
      try {
        const orders = JSON.parse(stored);
        return Array.isArray(orders) ? orders.length : 0;
      } catch {
        return 0;
      }
    }
    return 0;
  })();

  return (
    <AppLayout>
      <Head title="Retail Dashboard - Palm Oil Products Management" />

      <div className="py-6">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {isWelcomeVisible && (
            <div className="fixed top-6 right-6 z-50 p-4 mb-6 text-white bg-green-600 rounded-lg shadow-sm">
              Welcome back to your Palm Oil Products Retail Dashboard!
            </div>
          )}

          {/* Daily and Weekly Sales Cards */}
          <DailyWeeklySalesCards />

          {/* Add a full-width card at the top for available stock in retailer's store for each product */}
          {/* At the very top, show available customer orders and each product's available stock as individual cards in a flex row */}
          {/* Orders card and available stock cards in a single row at the top */}
          <div className="w-full flex flex-wrap gap-6 justify-center mt-4 mb-8">
            {/* Orders Card */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-8 py-4 flex flex-col items-center shadow min-w-[180px] max-w-[220px] text-center">
              <span className="text-lg font-semibold text-gray-700 mb-1">Orders</span>
              <span className="text-3xl font-bold text-yellow-700">{availableCustomerOrdersCount}</span>
          </div>
            {/* Available Stock Cards */}
            {inventory.map(product => (
              <div key={product.id} className="bg-green-50 border border-green-200 rounded-lg shadow px-8 py-4 flex flex-col items-center min-w-[180px] max-w-[220px]">
                <img src={product.image} alt={product.name} className="h-12 w-12 rounded-md object-cover mb-2" />
                <span className="text-2xl font-bold text-green-700 mt-1">{product.stock} {product.category === 'shampoo' ? 'bottles' : product.category === 'margarine' ? 'containers' : 'jerrycans'}</span>
              </div>
            ))}
                </div>
          {/* Add Stock Status Table Card */}
          <StockStatusTableCard inventory={inventory} />
          {/* Edit Product Stock and Place Retail Order side by side */}
          <div className="w-full flex flex-col md:flex-row gap-8 justify-center mb-8">
            <div className="flex-1 flex justify-center">
              <RetailerEditStockCard inventory={inventory} setInventory={setInventory} />
              </div>
            <div className="flex-1 flex justify-center">
              <PlaceRetailOrderCard inventory={inventory} onPlaceOrder={order => {
                setRetailOrders(prev => {
                  const updated = [...prev, order];
                  localStorage.setItem('retailOrders', JSON.stringify(updated));
                  return updated;
                });
              }} />
                </div>
              </div>
          {/* Retailer Order History Card (full-width, its own row) */}
          <div className="w-full flex justify-center mb-8">
            <div className="bg-white border border-blue-200 rounded-lg px-8 py-6 shadow w-full max-w-5xl">
              <RetailerOrderHistoryCard orders={retailOrders} setOrders={setRetailOrders} />
                </div>
              </div>

          {/* Always show all sections: inventory, orders, productions (sales), and communication (messages) */}
          {/* Removed grid container to allow full-width Available Customer Orders card */}
          {/* Available Orders Section */}
          <div className="w-full flex justify-center mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm mt-6 w-full max-w-5xl">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Available Customer Orders</h3>
              <AvailableOrdersCard />
                          </div>
                        </div>

          {/* Sales Dashboard Section */}
          <div className="lg:col-span-2">
            {/* Remove the grid with the three summary cards (Total Sales, Completed Orders, Pending Orders) from the retailer dashboard. */}

            {/* Sales Chart */}
            {/* Remove the 'Recent Orders' section and its table from the dashboard. */}
              </div>

          {/* Communications Section */}
          {/* Remove the Communications section (the card/column with messages and chat UI) */}
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
  );
}