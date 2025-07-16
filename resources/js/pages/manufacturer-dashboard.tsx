import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ResponsiveContainer, BarChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell, Line } from 'recharts'
import { Home, BarChart2, PieChart as PieChartIcon, ArrowLeft, MessageSquare, Send, Inbox, FileText, AlertOctagon, Trash2 } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import useStockStore from '@/store/useStockStore';
import useChatStore, { Message, MessageCategory } from '@/store/useChatStore';
import useInventoryChatStore, { InventoryMessage } from '@/store/useInventoryChatStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Mock data for the chart is now initial state
const initialProductionData = [
    { date: '2025-07-01', 'Cooking Oil': 400, Shampoo: 240, Margarine: 300 },
    { date: '2025-07-02', 'Cooking Oil': 300, Shampoo: 139, Margarine: 450 },
    { date: '2025-07-03', 'Cooking Oil': 200, Shampoo: 240, Margarine: 200 },
    { date: '2025-07-04', 'Cooking Oil': 278, Shampoo: 390, Margarine: 350 },
    { date: '2025-07-05', 'Cooking Oil': 189, Shampoo: 480, Margarine: 250 },
    { date: '2025-07-06', 'Cooking Oil': 239, Shampoo: 380, Margarine: 280 },
    { date: '2025-07-07', 'Cooking Oil': 349, Shampoo: 430, Margarine: 210 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

export default function ManufacturerDashboard() {
    const [notification, setNotification] = useState<string | null>(null)
    const [activeView, setActiveView] = useState('dashboard')
    const [productionData, setProductionData] = useState(initialProductionData)
    const { addStock } = useStockStore();

    const { totalProduction, averageProduction, productNames } = useMemo(() => {
        const productNames =
            productionData.length > 0
                ? Object.keys(productionData[0]).filter(key => key !== 'date')
                : []

        const totalProduction = productNames.reduce(
            (acc, productName) => {
                acc[productName] = productionData.reduce(
                    (sum, entry) => sum + ((entry as any)[productName] || 0),
                    0
                )
                return acc
            },
            {} as Record<string, number>
        )

        const averageProduction = productNames.reduce(
            (acc, productName) => {
                const total = totalProduction[productName]
                const count = productionData.filter(
                    entry => ((entry as any)[productName] || 0) > 0
                ).length
                acc[productName] = count > 0 ? total / count : 0
                return acc
            },
            {} as Record<string, number>
        )

        return { totalProduction, averageProduction, productNames }
    }, [productionData])

    const analyticsData = productNames.map(name => ({
        name,
        value: totalProduction[name] || 0,
    }))

    useEffect(() => {
        setNotification('Welcome, Manufacturer!')
        const timer = setTimeout(() => {
            setNotification(null)
        }, 5000) // Notification disappears after 5 seconds
        return () => clearTimeout(timer)
    }, [])

    const handleAddProductionData = (newData: { date: string; product: string; quantity: number }) => {
        setProductionData(prevData => {
            const existingEntryIndex = prevData.findIndex(d => d.date === newData.date);

            if (existingEntryIndex > -1) {
                // Update existing date entry
                const updatedData = [...prevData];
                const existingEntry = updatedData[existingEntryIndex];
                const newQuantity = (existingEntry[newData.product as keyof typeof existingEntry] || 0) as number + newData.quantity;

                updatedData[existingEntryIndex] = {
                    ...existingEntry,
                    [newData.product]: newQuantity,
                };
                return updatedData;
            } else {
                // Add new date entry
                const newEntry = {
                    date: newData.date,
                    'Cooking Oil': 0,
                    Shampoo: 0,
                    Margarine: 0,
                    [newData.product]: newData.quantity,
                };
                return [...prevData, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            }
        });
        addStock(newData.product, newData.quantity);
        setNotification(`Added ${newData.quantity} units of ${newData.product}. Factory store stock updated.`);
    };

    const renderView = () => {
        switch (activeView) {
            case 'chart':
                return <ChartView setActiveView={setActiveView} productionData={productionData} handleAddProductionData={handleAddProductionData} />
            case 'analytics':
                return <AnalyticsView setActiveView={setActiveView} analyticsData={analyticsData} averageProduction={averageProduction} />
            case 'dashboard':
            default:
                return <DashboardHome setActiveView={setActiveView} />
        }
    }

    return (
        <AppLayout>
            <div>
                <Head title="Manufacturer Dashboard" />

                {notification && (
                    <div className="fixed top-24 right-5 z-50 rounded-md bg-green-500 p-4 text-white shadow-lg animate-in fade-in-0 slide-in-from-top-5">
                        {notification}
                    </div>
                )}

                <div className="container mx-auto px-4 py-8">
                    {renderView()}
                </div>
            </div>
        </AppLayout>
    )
}

const ChatCard = () => {
    const {
        messages: factoryStoreMessages,
        addMessage: addFactoryStoreMessage,
        moveMessage: moveFactoryStoreMessage,
    } = useChatStore();
    const {
        messages: inventoryManagerMessages,
        addMessage: addInventoryManagerMessage,
        moveMessage: moveInventoryManagerMessage,
    } = useInventoryChatStore();

    const [activeChat, setActiveChat] = useState<'factoryStore' | 'inventoryManager'>('factoryStore');
    const [activeCategory, setActiveCategory] = useState<MessageCategory>('inbox');
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const messagePayload = {
            sender: 'Manufacturer' as const,
            text: newMessage,
            timestamp: new Date().toISOString(),
        };

        if (activeChat === 'factoryStore') {
            addFactoryStoreMessage(messagePayload, 'sent');
        } else {
            addInventoryManagerMessage(messagePayload, 'sent');
        }

        setNewMessage('');
    };

    const currentMessages = activeChat === 'factoryStore' ? factoryStoreMessages : inventoryManagerMessages;
    const chatTitle = activeChat === 'factoryStore' ? 'Factory Store Chat' : 'Inventory Manager Chat';
    const moveMessage = activeChat === 'factoryStore' ? moveFactoryStoreMessage : moveInventoryManagerMessage;

    const filteredMessages = currentMessages.filter(m => {
        if (activeCategory === 'inbox') return m.category === 'inbox';
        if (activeCategory === 'sent') return m.category === 'sent';
        if (activeCategory === 'draft') return m.category === 'draft';
        if (activeCategory === 'spam') return m.category === 'spam';
        if (activeCategory === 'trash') return m.category === 'trash';
        return false;
    });

    return (
        <Card className="bg-purple-800 flex flex-col text-purple-50 rounded-2xl max-w-md mx-auto">
            <div className="w-full border-b border-purple-600">
                <CardHeader>
                    <CardTitle className="text-purple-100 text-base">Mailbox</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    <nav className="flex flex-row space-x-1 justify-center">
                        <CategoryButton category="inbox" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<Inbox size={16} />} />
                        <CategoryButton category="sent" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<Send size={16} />} />
                        <CategoryButton category="draft" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<FileText size={16} />} />
                        <CategoryButton category="spam" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<AlertOctagon size={16} />} />
                        <CategoryButton category="trash" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<Trash2 size={16} />} />
                    </nav>
                </CardContent>
            </div>
            <div className="w-full">
        <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-purple-100 text-base">{chatTitle}</CardTitle>
                            <CardDescription className="capitalize text-purple-300">{activeCategory}</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                onClick={() => setActiveChat('factoryStore')}
                                variant={activeChat === 'factoryStore' ? 'default' : 'outline'}
                                size="sm"
                                className={activeChat !== 'factoryStore' ? 'text-black' : ''}
                            >
                                Factory Store
                            </Button>
                            <Button
                                onClick={() => setActiveChat('inventoryManager')}
                                variant={activeChat === 'inventoryManager' ? 'default' : 'outline'}
                                size="sm"
                                className={activeChat !== 'inventoryManager' ? 'text-black' : ''}
                            >
                                Inventory Manager
                            </Button>
                        </div>
                    </div>
        </CardHeader>
                <CardContent>
                    <div className="space-y-2 h-48 overflow-y-auto mb-4 p-2 border border-purple-600 rounded-md">
                        {filteredMessages.length > 0 ? filteredMessages.map((message) => (
                            <div key={message.id} className="group">
                                <div className={`flex text-sm ${message.sender === 'Manufacturer' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-2 rounded-lg ${message.sender === 'Manufacturer' ? 'bg-green-500 text-white' : 'bg-purple-700 text-purple-100'}`}>
                                        <p className="font-semibold text-xs">{message.sender}</p>
                                        <p>{message.text}</p>
                                        <p className="text-xs mt-1 opacity-75">{new Date(message.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="hidden group-hover:flex justify-end space-x-1 mt-1">
                                    {activeCategory !== 'trash' && <Button variant="outline" size="sm" onClick={() => moveMessage(message.id, 'trash')}><Trash2 size={12} /></Button>}
                                    {activeCategory !== 'spam' && <Button variant="outline" size="sm" onClick={() => moveMessage(message.id, 'spam')}><AlertOctagon size={12} /></Button>}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-purple-300 py-10">No messages in {activeCategory}.</div>
                        )}
                    </div>
                    {activeCategory === 'inbox' || activeCategory === 'draft' || activeCategory === 'sent' ? (
                        <div className="flex space-x-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="text-sm bg-purple-700 border-purple-600 placeholder:text-purple-300"
                            />
                            <Button onClick={handleSendMessage} variant="default" size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : null}
        </CardContent>
            </div>
    </Card>
);
};

const CategoryButton = ({ category, activeCategory, setActiveCategory, icon }: { category: MessageCategory, activeCategory: MessageCategory, setActiveCategory: (c: MessageCategory) => void, icon: React.ReactNode }) => (
    <Button
        variant={activeCategory === category ? 'secondary' : 'ghost'}
        className="w-full justify-start capitalize"
        onClick={() => setActiveCategory(category)}
    >
        {icon}
        <span className="ml-2">{category}</span>
    </Button>
)

const DashboardHome = ({ setActiveView }: { setActiveView: (view: string) => void }) => (
    <div>
        <div className="w-full bg-white py-6 px-4 shadow rounded mb-6">
            <h1 className="text-3xl font-bold text-purple-800 m-0">Manufacturer Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/" className="block">
                <DashboardCard
                    title="Home"
                    description="Return to the main welcome page."
                    icon={<Home className="h-10 w-10 text-gray-500" />}
                />
            </Link>
            <DashboardCard
                title="Analytics"
                description="Analyze production distribution."
                icon={<PieChartIcon className="h-10 w-10 text-green-500" />}
                onClick={() => setActiveView('analytics')}
            />
            <DashboardCard
                title="Chart"
                description="Visualize production data over time."
                icon={<BarChart2 className="h-10 w-10 text-blue-500" />}
                onClick={() => setActiveView('chart')}
            />
            <Dialog>
                <DialogTrigger asChild>
                    <DashboardCard
                        title="Communications"
                        description="Chat with other departments."
                        icon={<MessageSquare className="h-10 w-10 text-purple-500" />}
                    />
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
            <ChatCard />
                </DialogContent>
            </Dialog>
        </div>
    </div>
)

const DashboardCard = ({ title, description, icon, onClick }: { title: string, description: string, icon: React.ReactNode, onClick?: () => void }) => (
    <Card onClick={onClick} className="hover:shadow-lg transition-shadow cursor-pointer bg-yellow-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold text-purple-800">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
    </Card>
)

const ChartView = ({ setActiveView, productionData, handleAddProductionData }: { setActiveView: (view: string) => void, productionData: typeof initialProductionData, handleAddProductionData: (data: { date: string, product: string, quantity: number }) => void }) => (
    <div>
        <Button onClick={() => setActiveView('dashboard')} variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Production Bar Chart</CardTitle>
                        <CardDescription>Daily production quantities of different products.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={productionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Cooking Oil" fill="#3b82f6" />
                                <Bar dataKey="Shampoo" fill="#10b981" />
                                <Bar dataKey="Margarine" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Production Line Chart</CardTitle>
                        <CardDescription>Daily production trends of different products.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ResponsiveContainer>
                            <LineChart data={productionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Cooking Oil" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="Shampoo" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="Margarine" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
            <AddProductionDataCard onAddData={handleAddProductionData} />
            </div>
        </div>
    </div>
);

const AddProductionDataCard = ({ onAddData }: { onAddData: (data: { date: string, product: string, quantity: number }) => void }) => {
    const [date, setDate] = useState('');
    const [product, setProduct] = useState('Cooking Oil');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
            onAddData({
                date,
                product,
                quantity: parseInt(quantity, 10),
            });
            setDate('');
        setProduct('Cooking Oil');
            setQuantity('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Production Data</CardTitle>
                <CardDescription>Add a new production entry.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product">Product</Label>
                        <Select value={product} onValueChange={setProduct}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cooking Oil">Cooking Oil</SelectItem>
                                <SelectItem value="Shampoo">Shampoo</SelectItem>
                                <SelectItem value="Margarine">Margarine</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                    </div>
                    <Button type="submit">Add Entry</Button>
                </form>
            </CardContent>
        </Card>
    );
}

const AnalyticsView = ({ setActiveView, analyticsData, averageProduction }: { setActiveView: (view: string) => void, analyticsData: { name: string, value: number }[], averageProduction: Record<string, number> }) => (
    <div>
        <Button onClick={() => setActiveView('dashboard')} variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Production Analytics</CardTitle>
                    <CardDescription>Total production distribution.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] w-full">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={analyticsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                {analyticsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Average Production</CardTitle>
                    <CardDescription>Average production per product.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {Object.entries(averageProduction).map(([name, avg]) => (
                            <li key={name} className="flex justify-between">
                                <span>{name}</span>
                                <strong>{avg.toFixed(2)}</strong>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    </div>
); 