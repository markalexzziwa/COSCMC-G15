import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useInventoryChatStore from '@/store/useInventoryChatStore';
import { Send, BarChart2, TrendingUp, Package, AlertCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for the charts (replace with real data in production)
const inventoryData = [
  { name: 'Jan', stock: 4000 },
  { name: 'Feb', stock: 3000 },
  { name: 'Mar', stock: 2000 },
  { name: 'Apr', stock: 2780 },
  { name: 'May', stock: 1890 },
  { name: 'Jun', stock: 2390 },
  { name: 'Jul', stock: 3490 },
];

const oilTypesData = [
  { name: 'Palm Oil', value: 35 },
  { name: 'Sunflower Oil', value: 25 },
  { name: 'Olive Oil', value: 20 },
  { name: 'Canola Oil', value: 15 },
  { name: 'Coconut Oil', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const supplyTrendData = [
  { name: 'Week 1', supply: 4000, demand: 2400 },
  { name: 'Week 2', supply: 3000, demand: 1398 },
  { name: 'Week 3', supply: 2000, demand: 9800 },
  { name: 'Week 4', supply: 2780, demand: 3908 },
];

const turnoverData = [
  { month: 'Jan', turnover: 85 },
  { month: 'Feb', turnover: 78 },
  { month: 'Mar', turnover: 92 },
  { month: 'Apr', turnover: 88 },
  { month: 'May', turnover: 95 },
  { month: 'Jun', turnover: 82 },
];

// Updated oil types data based on current stock
const updatedOilTypesData = [
  { name: 'Palm Oil', value: 35 },
  { name: 'Coconut Oil', value: 20 },
  { name: 'Sunflower Oil', value: 25 },
  { name: 'Olive Oil', value: 15 },
  { name: 'Canola Oil', value: 5 },
];

// Mock farmer data
const farmerData = {
  name: 'John Mukiibi',
  location: 'Kampala, Uganda',
  produce: 'Palm Oil',
};

const AvailableRawMaterialsCard = ({ 
  palmOilStock, 
  coconutOilStock, 
  onPalmOilChange, 
  onCoconutOilChange 
}: {
  palmOilStock: number;
  coconutOilStock: number;
  onPalmOilChange: (value: number) => void;
  onCoconutOilChange: (value: number) => void;
}) => {
  const [palmOilInput, setPalmOilInput] = useState(palmOilStock.toString());
  const [coconutOilInput, setCoconutOilInput] = useState(coconutOilStock.toString());

  const handlePalmOilUpdate = () => {
    const value = parseInt(palmOilInput) || 0;
    onPalmOilChange(value);
  };

  const handleCoconutOilUpdate = () => {
    const value = parseInt(coconutOilInput) || 0;
    onCoconutOilChange(value);
  };

  // Update input values when props change
  useEffect(() => {
    setPalmOilInput(palmOilStock.toString());
  }, [palmOilStock]);

  useEffect(() => {
    setCoconutOilInput(coconutOilStock.toString());
  }, [coconutOilStock]);

  return (
  <Card>
    <CardHeader>
        <CardTitle>Available Raw Materials</CardTitle>
        <CardDescription>Current stock levels of raw materials</CardDescription>
    </CardHeader>
    <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Palm Oil (Liters)</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={palmOilInput}
                onChange={(e) => setPalmOilInput(e.target.value)}
                className="flex-1"
                min="0"
                placeholder="Enter new stock level"
              />
              <Button 
                onClick={handlePalmOilUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Update
              </Button>
              <span className="text-sm text-gray-500">L</span>
            </div>
            <div className="text-xs text-gray-500">
              Current: {palmOilStock}L
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Coconut Oil (Liters)</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={coconutOilInput}
                onChange={(e) => setCoconutOilInput(e.target.value)}
                className="flex-1"
                min="0"
                placeholder="Enter new stock level"
              />
              <Button 
                onClick={handleCoconutOilUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Update
              </Button>
              <span className="text-sm text-gray-500">L</span>
            </div>
            <div className="text-xs text-gray-500">
              Current: {coconutOilStock}L
            </div>
          </div>
        </div>
    </CardContent>
  </Card>
);
};

// Farmer chat store (simple local state for demo)
const useFarmerChatStore = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'Farmer',
      text: 'Hello, I have fresh Palm Oil ready for delivery.',
      timestamp: new Date().toISOString(),
    },
  ]);

  const addMessage = (message: { sender: string; text: string; timestamp: string }) => {
    setMessages((prev) => [...prev, message]);
  };

  return { messages, addMessage };
};

const FarmerChatCard = () => {
  const { messages, addMessage } = useFarmerChatStore();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    addMessage({
      sender: 'Farmer',
      text: newMessage,
      timestamp: new Date().toISOString(),
    });
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Chat</CardTitle>
        <CardDescription>Chat with Inventory Manager</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-64 overflow-y-auto mb-4 p-4 border rounded-md">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'Farmer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs md:max-w-md ${
                    message.sender === 'Farmer' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  <p className="font-semibold">{message.sender}</p>
                  <p>{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <Button onClick={handleSendMessage} variant="default" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function InventoryManagerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);
  const [palmOilStock, setPalmOilStock] = useState(150);
  const [coconutOilStock, setCoconutOilStock] = useState(80);
  const [inventoryOrders, setInventoryOrders] = useState<any[]>([]);
  const [farmOrder, setFarmOrder] = useState({
    palmOilQuantity: 0,
    coconutOilQuantity: 0,
    deliveryDate: ''
  });

  // Load stock levels from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPalmOil = localStorage.getItem('palmOilStock');
      const savedCoconutOil = localStorage.getItem('coconutOilStock');
      const savedInventoryOrders = localStorage.getItem('inventoryOrders');
      
      if (savedPalmOil) {
        setPalmOilStock(parseInt(savedPalmOil) || 150);
      }
      if (savedCoconutOil) {
        setCoconutOilStock(parseInt(savedCoconutOil) || 80);
      }
      if (savedInventoryOrders) {
        setInventoryOrders(JSON.parse(savedInventoryOrders));
      }
    }
  }, []);

  // Save stock levels to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('palmOilStock', palmOilStock.toString());
      localStorage.setItem('coconutOilStock', coconutOilStock.toString());
    }
  }, [palmOilStock, coconutOilStock]);

  // Save inventory orders to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('inventoryOrders', JSON.stringify(inventoryOrders));
    }
  }, [inventoryOrders]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNotificationVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate expected deliveries for today
  const getExpectedDeliveries = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = inventoryOrders.filter(order => order.deliveryDate === today);
    
    const totalPalmOilExpected = todaysOrders.reduce((sum, order) => sum + order.palmOilQuantity, 0);
    const totalCoconutOilExpected = todaysOrders.reduce((sum, order) => sum + order.coconutOilQuantity, 0);
    
    return {
      palmOil: totalPalmOilExpected,
      coconutOil: totalCoconutOilExpected,
      total: totalPalmOilExpected + totalCoconutOilExpected
    };
  };

  const expectedDeliveries = getExpectedDeliveries();

  // Handle placing farm orders
  const handlePlaceFarmOrders = () => {
    if (farmOrder.palmOilQuantity <= 0 && farmOrder.coconutOilQuantity <= 0) {
      alert('Please enter quantities greater than 0');
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      type: 'farm_order',
      palmOilQuantity: farmOrder.palmOilQuantity,
      coconutOilQuantity: farmOrder.coconutOilQuantity,
      deliveryDate: farmOrder.deliveryDate,
      status: 'Placed'
    };

    setInventoryOrders(prev => [...prev, newOrder]);
    
    // Reset form
    setFarmOrder({
      palmOilQuantity: 0,
      coconutOilQuantity: 0,
      deliveryDate: ''
    });
    
    setIsNotificationVisible(true);
  };

  // Define thresholds for critical inventory
  const thresholds = {
    palmOil: 200,
    coconutOil: 100
  };

  // Calculate critical items based on current stock
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

  // Filter to show all items (not just critical ones)
  const allInventoryItems = criticalItems;

  // Update oil types data based on current stock
  const updatedOilTypesData = [
    { name: 'Palm Oil', value: Math.round((palmOilStock / (palmOilStock + coconutOilStock)) * 100) || 0 },
    { name: 'Coconut Oil', value: Math.round((coconutOilStock / (palmOilStock + coconutOilStock)) * 100) || 0 },
  ];

  return (
    <AppLayout>
      <Head title="Cooking Oil Inventory Dashboard" />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Cooking Oil Inventory</h1>
            <p className="text-gray-600">Monitor and manage your cooking oil supply chain</p>
          </div>
          {isNotificationVisible && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
              <p>Inventory levels updated 5 minutes ago</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Stock"
            value={`${palmOilStock + coconutOilStock} L`}
            change="+2.5%"
            icon={<Package className="h-6 w-6" />}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Palm Oil Stock"
            value={`${palmOilStock} L`}
            change={palmOilStock < thresholds.palmOil ? "Low Stock" : "Adequate Stock"}
            icon={<TrendingUp className="h-6 w-6" />}
            color={palmOilStock < thresholds.palmOil ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}
          />
          <StatCard
            title="Coconut Oil Stock"
            value={`${coconutOilStock} L`}
            change={coconutOilStock < thresholds.coconutOil ? "Low Stock" : "Adequate Stock"}
            icon={<AlertCircle className="h-6 w-6" />}
            color={coconutOilStock < thresholds.coconutOil ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}
          />
          <StatCard
            title="Expected Deliveries"
            value={`${expectedDeliveries.total} L`}
            change={`${expectedDeliveries.total > 0 ? '+' : ''}${expectedDeliveries.total} L`}
            icon={<BarChart2 className="h-6 w-6" />}
            color="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Inventory Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Order Quantity Trends (Last 7 Orders)</CardTitle>
              <CardDescription>Variance of Palm Oil and Coconut Oil quantities in recent farm orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={(() => {
                    // Get last 7 orders and create chart data
                    const last7Orders = inventoryOrders
                      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .slice(0, 7)
                      .reverse(); // Reverse to show chronological order
                    
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
                    <Line
                      type="monotone"
                      dataKey="Palm Oil" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Coconut Oil" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Oil Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Oil Type Distribution</CardTitle>
              <CardDescription>Current inventory by oil type</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Supply vs Demand Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Supply vs Demand Analysis</CardTitle>
              <CardDescription>Variance of quantities demanded by inventory and manufacturer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(() => {
                    // Get today's date in YYYY-MM-DD format
                    const today = new Date().toISOString().split('T')[0];
                    
                    // Calculate total quantities expected today from inventory orders
                    const todayInventoryDeliveries = inventoryOrders
                      .filter((order: any) => order.deliveryDate === today)
                      .reduce((acc: any, order: any) => {
                        acc.palmOil += order.palmOilQuantity;
                        acc.coconutOil += order.coconutOilQuantity;
                        return acc;
                      }, { palmOil: 0, coconutOil: 0 });

                    // Calculate total quantities expected today from manufacturer orders
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
            </CardContent>
          </Card>

          {/* Inventory Turnover */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Turnover Rate</CardTitle>
              <CardDescription>Monthly turnover for different oil types</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Raw Material Order History */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Raw Material Order History</CardTitle>
              <CardDescription>History of raw material orders from manufacturers</CardDescription>
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

        {/* Farm Order Card */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Order from Farms</CardTitle>
              <CardDescription>Place orders for raw materials from local farms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Palm Oil Quantity (L)</label>
                    <Input
                      type="number"
                      value={farmOrder.palmOilQuantity}
                      onChange={(e) => setFarmOrder(prev => ({ ...prev, palmOilQuantity: parseInt(e.target.value) || 0 }))}
                      className="mb-2"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Coconut Oil Quantity (L)</label>
                    <Input
                      type="number"
                      value={farmOrder.coconutOilQuantity}
                      onChange={(e) => setFarmOrder(prev => ({ ...prev, coconutOilQuantity: parseInt(e.target.value) || 0 }))}
                      className="mb-2"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Delivery Date</label>
                  <Input
                    type="date"
                    value={farmOrder.deliveryDate}
                    onChange={(e) => setFarmOrder(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    className="mb-2"
                  />
                </div>
                <div className="flex justify-center">
                  <Button 
                    onClick={handlePlaceFarmOrders}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  >
                    Place Farm Orders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Raw Material Order */}
        <div className="mb-8">
          <Card>
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
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((order) => (
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

        {/* 2x2 Grid for Critical, Available Raw Materials, Farmer Chat, Manufacturer Chat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current stock levels and status</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          <AvailableRawMaterialsCard 
            palmOilStock={palmOilStock} 
            coconutOilStock={coconutOilStock} 
            onPalmOilChange={setPalmOilStock} 
            onCoconutOilChange={setCoconutOilStock} 
          />
          <FarmerChatCard />
          <ChatCard />
        </div>
      </div>
    </AppLayout>
  );
}

const StatCard = ({ title, value, change, icon, color }: { title: string; value: string; change: string; icon: React.ReactNode; color: string }) => {
  const isPositive = change.includes('Adequate Stock') || change.startsWith('+');
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className={`text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {change} {isPositive ? '↑' : '↓'}
            </p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const ChatCard = () => {
  const { messages, addMessage } = useInventoryChatStore();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    addMessage({
      sender: 'Inventory Manager',
      text: newMessage,
      timestamp: new Date().toISOString(),
    });

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manufacturer Chat</CardTitle>
        <CardDescription>Communicate with suppliers and team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-64 overflow-y-auto mb-4 p-4 border rounded-md">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'Inventory Manager' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs md:max-w-md ${
                    message.sender === 'Inventory Manager' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  <p className="font-semibold">{message.sender}</p>
                  <p>{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <Button onClick={handleSendMessage} variant="default" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};