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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TotalStockCard stock={stock} />
                    <StockByBoxCard stock={stock} />
                    <UpdateStockCard currentStock={stock} onUpdateStock={handleStockUpdate} />
                    <UpdateByPackageCard currentStock={stock} onAddStock={handleStockAdd} />
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
    currentStock: { name: string; quantity: number, image: string, unit: string, packageSize: number, packageUnit: string }[]
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
                                        className="w-24"
                                        placeholder="# of packages"
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
                                    className="w-24"
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