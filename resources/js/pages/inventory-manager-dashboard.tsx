import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
            <label className="text-sm font-medium text-gray-700">Palm Oil (kg)</label>
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
              <span className="text-sm text-gray-500">kg</span>
                </div>
            <div className="text-xs text-gray-500">
              Current: {palmOilStock}kg
            </div>
        </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Coconut (kg)</label>
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
              <span className="text-sm text-gray-500">kg</span>
            </div>
            <div className="text-xs text-gray-500">
              Current: {coconutOilStock}kg
            </div>
          </div>
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
      <Head title="Inventory Managment" />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Palm oil fruits and Coconut Inventory</h1>
            <p className="text-gray-600">Monitor and manage your raw materials adquetly</p>
          </div>
          {isNotificationVisible && (
            <div className="bg-blue-100 border-l-4 border-blue-50 text-blue-900 p-4 rounded">
              <p>Inventory levels updated 5 minutes ago</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Stock"
            value={`${palmOilStock + coconutOilStock} kg`}
            change="+2.5%"
            icon={<Package className="h-6 w-6" />}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Palm Oil Stock"
            value={`${palmOilStock} kg`}
            change={palmOilStock < thresholds.palmOil ? "Low Stock" : "Adequate Stock"}
            icon={<TrendingUp className="h-6 w-6" />}
            color={palmOilStock < thresholds.palmOil ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}
          />
          <StatCard
            title="Coconut Oil Stock"
            value={`${coconutOilStock} kg`}
            change={coconutOilStock < thresholds.coconutOil ? "Low Stock" : "Adequate Stock"}
            icon={<AlertCircle className="h-6 w-6" />}
            color={coconutOilStock < thresholds.coconutOil ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}
          />
          <StatCard
            title="Expected Deliveries"
            value={`${expectedDeliveries.total} kg`}
            change={`${expectedDeliveries.total > 0 ? '+' : ''}${expectedDeliveries.total} kg`}
            icon={<BarChart2 className="h-6 w-6" />}
            color="bg-purple-100 text-purple-600"
          />
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
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Needed</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Palm Oil:</span>
                              <span className="ml-2 text-blue-600 font-semibold">
                                {group.totalPalmOil}kg
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Coconut Oil:</span>
                              <span className="ml-2 text-blue-600 font-semibold">
                                {group.totalCoconutOil}kg
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
              <CardTitle>Order Farmer</CardTitle>
              <CardDescription>Place orders for raw materials from local farms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Palm Oil Quantity (kg)</label>
                    <Input
                      type="number"
                      value={farmOrder.palmOilQuantity}
                      onChange={(e) => setFarmOrder(prev => ({ ...prev, palmOilQuantity: parseInt(e.target.value) || 0 }))}
                      className="mb-2"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Coconut Oil Quantity (kg)</label>
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
                            <Button
                                onClick={() => {
                                    // Update order status to 'products reached' in localStorage and state
                                    const updatedOrders = inventoryOrders.map(o => o.id === order.id ? { ...o, status: 'products reached' } : o);
                                    setInventoryOrders(updatedOrders);
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem('inventoryOrders', JSON.stringify(updatedOrders));
                                    }
                                }}
                                className="ml-2 px-4 py-2 text-white rounded-md transition-colors bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                            >
                                Receive
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Palm Oil:</span>
                              <span className="ml-2 text-blue-600 font-semibold">
                                {order.palmOilQuantity}kg
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Coconut Oil:</span>
                              <span className="ml-2 text-blue-600 font-semibold">
                                {order.coconutOilQuantity}kg
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
                        Current: {item.current}kg | Threshold: {item.threshold}kg
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