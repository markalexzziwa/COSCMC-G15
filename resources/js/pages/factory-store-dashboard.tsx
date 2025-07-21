import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useStockStore from '@/store/useStockStore'
import useChatStore from '@/store/useChatStore'
import { Plus, Minus, Send } from 'lucide-react'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'

export default function FactoryStoreDashboard() {
    const [notification, setNotification] = useState<string | null>(null)
    const { stock, updateStock, addStock } = useStockStore()
    const { messages, addMessage } = useChatStore()
    const [productionOrders, setProductionOrders] = useState<any[]>(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('factoryProductionOrders');
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

    const graphData = useMemo(() => {
        return stock.map(item => {
            const currentPackages = Math.floor(item.quantity / item.packageSize);
            const currentBoxes = Math.floor(currentPackages / item.boxSize);
            return { name: item.name, boxes: currentBoxes };
        });
    }, [stock]);

    useEffect(() => {
        setNotification("You're logged in as a Factory Store user!")
        const timer = setTimeout(() => {
            setNotification(null)
        }, 4000)

        return () => clearTimeout(timer)
    }, [])

    const handleStockUpdate = (productName: string, newQuantity: number) => {
        updateStock(productName, newQuantity)
        setNotification(`${productName} stock updated to ${newQuantity}`)
    }

    const handleStockAdd = (productName: string, quantity: number) => {
        const product = stock.find((s) => s.name === productName);
        if (product) {
            addStock(productName, quantity);
            setNotification(`Added ${quantity} ${product.unit} of ${productName}.`);
        }
    };

    return (
        <AppLayout>
            <Head title="Factory Store Dashboard" />

            {notification && (
                <div className="fixed top-24 right-5 z-50 rounded-md bg-blue-500 p-4 text-black shadow-lg animate-in fade-in-0 slide-in-from-top-5">
                    <p className="font-bold">Now!</p>
                    <p>{notification}</p>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Factory Store Dashboard</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                    <FactoryStoreSalesSummaryCards />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TotalStockCard stock={stock} />
                    <StockByBoxCard stock={stock} />
                    <UpdateStockCard currentStock={stock} onUpdateStock={handleStockUpdate} />
                    <UpdateByPackageCard currentStock={stock} onAddStock={handleStockAdd} />
                </div>
                {/* Production Order Card */}
                <div className="mb-8">
                    <FactoryProductionOrderCard productionOrders={productionOrders} setProductionOrders={setProductionOrders} />
                </div>
                {/* Products Order History Card */}
                <div className="mb-8">
                    <FactoryProductionOrderHistoryCard productionOrders={productionOrders} />
                </div>
                {/* Distributor Order History Card */}
                <div className="mt-10">
                    <DistributorOrderHistoryCard />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Chat card removed; chat is now only available via the chat page */}
                </div>
            </div>
        </AppLayout>
    )
}

function CombinedFactoryStoreChatCard() {
    const [activeChat, setActiveChat] = useState<'manufacturer' | 'distributor'>('manufacturer');
    const [manufacturerMessages, setManufacturerMessages] = useState([
        { sender: 'Manufacturer', text: 'Welcome to the chat! How can I help you?', timestamp: new Date().toISOString() }
    ]);
    const [distributorMessages, setDistributorMessages] = useState([
        { sender: 'Distributor', text: 'Hello Factory Store! Ready for the next shipment?', timestamp: new Date().toISOString() }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const msg = {
            sender: 'Factory Store',
            text: newMessage,
            timestamp: new Date().toISOString(),
        };
        if (activeChat === 'manufacturer') {
            setManufacturerMessages(prev => [...prev, msg]);
            setIsReplying(true);
            setTimeout(() => {
                setManufacturerMessages(prev => [...prev, {
                    sender: 'Manufacturer',
                    text: 'Thank you for your message! We will assist you shortly.',
                    timestamp: new Date().toISOString(),
                }]);
                setIsReplying(false);
            }, 1200);
        } else {
            setDistributorMessages(prev => [...prev, msg]);
            setIsReplying(true);
            setTimeout(() => {
                setDistributorMessages(prev => [...prev, {
                    sender: 'Distributor',
                    text: 'Thank you for your message! We will coordinate with you soon.',
                    timestamp: new Date().toISOString(),
                }]);
                setIsReplying(false);
            }, 1200);
        }
        setNewMessage('');
    };

    const messages = activeChat === 'manufacturer' ? manufacturerMessages : distributorMessages;
    const chatTitle = activeChat === 'manufacturer' ? 'Manufacturer' : 'Distributor';
    const chatDescription = activeChat === 'manufacturer'
        ? 'Chat directly with the manufacturer for supply and support.'
        : 'Chat directly with the distributor for logistics and coordination.';

    return (
        <Card className="bg-pink-50">
            <CardHeader>
                <CardTitle>Contact {chatTitle}</CardTitle>
                <CardDescription>{chatDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex mb-4 space-x-2">
                    <Button
                        onClick={() => setActiveChat('manufacturer')}
                        className={activeChat === 'manufacturer' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                    >
                        Manufacturer
                    </Button>
                    <Button
                        onClick={() => setActiveChat('distributor')}
                        className={activeChat === 'distributor' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                    >
                        Distributor
                    </Button>
                </div>
                <div className="space-y-4 h-64 overflow-y-auto mb-4 p-4 border rounded-md bg-white">
                    {messages.map((message, idx) => (
                        <div key={idx} className={`flex ${message.sender === 'Factory Store' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${message.sender === 'Factory Store' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                <p className="font-semibold">{message.sender}</p>
                                <p>{message.text}</p>
                                <p className="text-xs mt-1 opacity-70">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    ))}
                    {isReplying && (
                        <div className="flex justify-start mb-2">
                            <div className="max-w-xs md:max-w-md rounded-lg p-3 bg-gray-200 text-black opacity-70">
                                <p className="font-medium">{chatTitle}</p>
                                <p className="mt-1 italic">Typing...</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex space-x-2">
                    <Input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder={`Type your message to the ${chatTitle.toLowerCase()}...`}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        disabled={isReplying}
                    />
                    <Button onClick={handleSendMessage} variant="info" size="icon" disabled={!newMessage.trim() || isReplying}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

const StockByBoxCard = ({ stock }: { stock: { name: string; quantity: number, image: string, unit: string, packageSize: number, packageUnit: string, boxSize: number }[] }) => (
    <Card className="bg-pink-50">
        <CardHeader>
            <CardTitle>Stock by Box</CardTitle>
            <CardDescription>Total number of boxes for each product.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {stock.map((item) => {
                    const currentPackages = Math.floor(item.quantity / item.packageSize);
                    const currentBoxes = Math.floor(currentPackages / item.boxSize);
                    return (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                                <p className="font-semibold">{item.name}</p>
                            </div>
                            <p className="text-lg font-bold">{`${currentBoxes.toLocaleString()} boxes`}</p>
                        </div>
                    )
                })}
            </div>
        </CardContent>
    </Card>
);

const TotalStockCard = ({ stock }: { stock: { name: string; quantity: number, image: string, unit: string }[] }) => (
    <Card className="bg-pink-50">
        <CardHeader>
            <CardTitle>Available Stock in units</CardTitle>
            <CardDescription>Total stock for each product.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {stock.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                            <p className="font-semibold">{item.name}</p>
                        </div>
                        <p className="text-lg font-bold">{`${item.quantity.toLocaleString()} ${item.unit}`}</p>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const UpdateByPackageCard = ({
    currentStock,
    onAddStock,
}: {
    currentStock: { name: string; quantity: number, image: string, unit: string, packageSize: number, packageUnit: string, boxSize: number }[]
    onAddStock: (productName: string, quantity: number) => void
}) => {
    const [packageUpdates, setPackageUpdates] = useState<Record<string, number | string>>({});

    const handleAddPackages = (productName: string, packageSize: number) => {
        const numPackages = packageUpdates[productName];
        if (typeof numPackages === 'number' && numPackages > 0) {
            const quantityToAdd = numPackages * packageSize;
            onAddStock(productName, quantityToAdd);
            setPackageUpdates(prev => ({ ...prev, [productName]: '' }));
        }
    };

    return (
        <Card className="bg-pink-50">
            <CardHeader>
                <CardTitle>Add Stock by Package</CardTitle>
                <CardDescription>Add stock based on the number of packages.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {currentStock.map((item) => {
                        const currentPackages = Math.floor(item.quantity / item.packageSize);
                        return (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">{`1 ${item.packageUnit} = ${item.packageSize} ${item.unit}`}</p>
                                        <p className="text-sm text-gray-500">{`Current: ${currentPackages.toLocaleString()} ${item.packageUnit}s`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="number"
                                        value={packageUpdates[item.name] || ''}
                                        onChange={(e) => setPackageUpdates(prev => ({ ...prev, [item.name]: e.target.value ? parseInt(e.target.value, 10) : '' }))}
                                        className="w-48"
                                        placeholder={`${item.boxSize} ${item.packageUnit}s@ box`}
                                    />
                                    <Button onClick={() => handleAddPackages(item.name, item.packageSize)} variant="info">Add</Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

const UpdateStockCard = ({
    currentStock,
    onUpdateStock,
}: {
    currentStock: { name: string; quantity: number, image: string, unit: string }[]
    onUpdateStock: (productName: string, newQuantity: number) => void
}) => {
    const [updates, setUpdates] = useState<Record<string, number | string>>({});

    const handleIncrease = (productName: string, currentQuantity: number) => {
        onUpdateStock(productName, currentQuantity + 5);
    };

    const handleDecrease = (productName: string, currentQuantity: number) => {
        onUpdateStock(productName, Math.max(0, currentQuantity - 5));
    };

    const handleManualUpdate = (productName: string) => {
        const newQuantity = updates[productName];
        if (typeof newQuantity === 'number' && newQuantity >= 0) {
            onUpdateStock(productName, newQuantity);
            setUpdates(prev => ({ ...prev, [productName]: '' }));
        }
    };

    return (
        <Card className="bg-pink-50">
            <CardHeader>
                <CardTitle>Update Stock by units</CardTitle>
                <CardDescription>Adjust stock using the buttons or enter a value manually.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {currentStock.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">{`Current: ${item.quantity.toLocaleString()} ${item.unit}`}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button size="icon" variant="outline" onClick={() => handleDecrease(item.name, item.quantity)}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline" onClick={() => handleIncrease(item.name, item.quantity)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    value={updates[item.name] || ''}
                                    onChange={(e) => setUpdates(prev => ({ ...prev, [item.name]: e.target.value ? parseInt(e.target.value, 10) : '' }))}
                                    className="w-48"
                                    placeholder="Set Qty"
                                />
                                <Button onClick={() => handleManualUpdate(item.name)} variant="info">Update</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function DistributorOrderHistoryCard() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('distributorOrders');
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
    return <div className="bg-white shadow rounded-lg p-8 text-gray-500">No distributor orders found.</div>;
  }
  return (
    <div className="bg-white shadow rounded-lg p-8">
      <h2 className="text-xl font-bold mb-4">Distributor Order History</h2>
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
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">Placed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FactoryStoreSalesSummaryCards() {
  const [daily, setDaily] = useState(0);
  const [weekly, setWeekly] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
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
    <>
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
    </>
  );
}

function FactoryProductionOrderCard({ productionOrders, setProductionOrders }: { productionOrders: any[], setProductionOrders: (orders: any[]) => void }) {
  const [quantities, setQuantities] = useState({
    cookingOil: '',
    shampoo: '',
    margarine: '',
  });
  const [success, setSuccess] = useState(false);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('factoryProductionOrders', JSON.stringify([...productionOrders].reverse()));
    }
  }, [productionOrders]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuantities(prev => ({ ...prev, [name]: value.replace(/[^0-9]/g, '') }));
  };

  const handlePlaceOrder = () => {
    const items = [
      { name: 'Cooking Oil', quantity: Number(quantities.cookingOil) },
      { name: 'Shampoo', quantity: Number(quantities.shampoo) },
      { name: 'Soft Margarine', quantity: Number(quantities.margarine) },
    ].filter(item => item.quantity > 0);
    if (items.length === 0) return;
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items,
    };
    setProductionOrders([order, ...productionOrders]);
    setQuantities({ cookingOil: '', shampoo: '', margarine: '' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="bg-white shadow rounded-lg p-8">
      <h2 className="text-xl font-bold mb-4">Place Production Order</h2>
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
            placeholder="Quantity"
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
            placeholder="Quantity"
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
            placeholder="Quantity"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handlePlaceOrder} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-semibold">Place Order</Button>
      </div>
      {success && <div className="mt-4 text-green-600 font-semibold">Order placed successfully!</div>}
    </div>
  );
}

function FactoryProductionOrderHistoryCard({ productionOrders }: { productionOrders: any[] }) {
  const orders = productionOrders;
  if (orders.length === 0) {
    return <div className="bg-white shadow rounded-lg p-8 text-gray-500">No production orders found.</div>;
  }
  return (
    <div className="bg-white shadow rounded-lg p-8">
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