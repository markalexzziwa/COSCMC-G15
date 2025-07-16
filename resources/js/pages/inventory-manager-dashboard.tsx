import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
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

const criticalItems = [
  { id: 1, name: 'Palm Oil', current: 150, threshold: 200 },
  { id: 2, name: 'Olive Oil', current: 180, threshold: 250 },
];

// Mock farmer data
const farmerData = {
  name: 'John Mukiibi',
  location: 'Kampala, Uganda',
  produce: 'Palm Oil',
};

const FarmerCard = ({ farmer }: { farmer: { name: string; location: string; produce: string } }) => (
  <Card>
    <CardHeader>
      <CardTitle>Farmer Info</CardTitle>
      <CardDescription>Details about the farmer</CardDescription>
    </CardHeader>
    <CardContent>
      <p><strong>Name:</strong> {farmer.name}</p>
      <p><strong>Location:</strong> {farmer.location}</p>
      <p><strong>Produce:</strong> {farmer.produce}</p>
    </CardContent>
  </Card>
);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNotificationVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

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
            value="12,450 L"
            change="+2.5%"
            icon={<Package className="h-6 w-6" />}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Monthly Supply"
            value="8,200 L"
            change="+5.1%"
            icon={<TrendingUp className="h-6 w-6" />}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Critical Items"
            value="2"
            change="+1"
            icon={<AlertCircle className="h-6 w-6" />}
            color="bg-red-100 text-red-600"
          />
          <StatCard
            title="Avg. Turnover"
            value="4.2 days"
            change="-0.3"
            icon={<BarChart2 className="h-6 w-6" />}
            color="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Inventory Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Inventory Levels (Liters)</CardTitle>
              <CardDescription>Last 7 months of cooking oil inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inventoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="stock"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Inventory Level"
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
                      data={oilTypesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {oilTypesData.map((entry, index) => (
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

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Supply vs Demand */}
          <Card>
            <CardHeader>
              <CardTitle>Supply vs Demand</CardTitle>
              <CardDescription>Weekly comparison of supply and demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supplyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="supply" fill="#8884d8" name="Supply (L)" />
                    <Bar dataKey="demand" fill="#82ca9d" name="Demand (L)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2x2 Grid for Critical, Farmer Info, Farmer Chat, Manufacturer Chat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Critical Inventory</CardTitle>
              <CardDescription>Items below threshold levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Current: {item.current}L | Threshold: {item.threshold}L
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Order
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <FarmerCard farmer={farmerData} />
          <FarmerChatCard />
          <ChatCard />
        </div>
      </div>
    </AppLayout>
  );
}

const StatCard = ({ title, value, change, icon, color }: { title: string; value: string; change: string; icon: React.ReactNode; color: string }) => {
  const isPositive = change.startsWith('+');
  
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