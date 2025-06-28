import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ResponsiveContainer, BarChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell, Line } from 'recharts'
import { Home, BarChart2, PieChart as PieChartIcon, ArrowLeft, MessageSquare } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Mock data for the chart is now initial state
const initialProductionData = [
    { date: '2024-07-01', 'Cooking Oil': 400, Shampoo: 240, Margarine: 300 },
    { date: '2024-07-02', 'Cooking Oil': 300, Shampoo: 139, Margarine: 450 },
    { date: '2024-07-03', 'Cooking Oil': 200, Shampoo: 980, Margarine: 200 },
    { date: '2024-07-04', 'Cooking Oil': 278, Shampoo: 390, Margarine: 350 },
    { date: '2024-07-05', 'Cooking Oil': 189, Shampoo: 480, Margarine: 250 },
    { date: '2024-07-06', 'Cooking Oil': 239, Shampoo: 380, Margarine: 280 },
    { date: '2024-07-07', 'Cooking Oil': 349, Shampoo: 430, Margarine: 210 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

export default function ManufacturerDashboard() {
    const [notification, setNotification] = useState<string | null>(null)
    const [activeView, setActiveView] = useState('dashboard')
    const [productionData, setProductionData] = useState(initialProductionData)

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
            <div className="bg-yellow-100 h-full">
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

const ChatCard = () => (
    <Card className="md:col-span-3 bg-purple-100">
        <CardHeader>
            <CardTitle className="text-purple-800">Communications</CardTitle>
            <CardDescription>Start a conversation</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
                onClick={() => alert('Chat with Inventory Manager clicked!')}
                className="hover:shadow-lg transition-shadow cursor-pointer p-4 flex flex-col items-center justify-center"
                style={{ backgroundColor: '#FFF5F7' }}
            >
                <MessageSquare className="h-8 w-8 text-purple-500 mb-2" />
                <p className="font-semibold text-center text-purple-800">Chat with Inventory Manager</p>
            </Card>
            <Card
                onClick={() => alert('Chat with Factory Store clicked!')}
                className="hover:shadow-lg transition-shadow cursor-pointer p-4 flex flex-col items-center justify-center"
                style={{ backgroundColor: '#FFF5F7' }}
            >
                <MessageSquare className="h-8 w-8 text-indigo-500 mb-2" />
                <p className="font-semibold text-center text-purple-800">Chat with Factory Store</p>
            </Card>
        </CardContent>
    </Card>
);

const DashboardHome = ({ setActiveView }: { setActiveView: (view: string) => void }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-purple-800">Manufacturer Dashboard</h1>
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
            <ChatCard />
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
            <AddProductionDataCard onAddData={handleAddProductionData} />
        </div>
    </div>
)

const AddProductionDataCard = ({ onAddData }: { onAddData: (data: { date: string, product: string, quantity: number }) => void }) => {
    const [date, setDate] = useState('');
    const [product, setProduct] = useState('Cooking Oil');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && product && quantity) {
            onAddData({
                date,
                product,
                quantity: parseInt(quantity, 10),
            });
            setDate('');
            setQuantity('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Production Data</CardTitle>
                <CardDescription>Add product quantity for a specific date.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div>
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
                    <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 120" required />
                    </div>
                    <Button type="submit" className="w-full">Add Data</Button>
                </form>
            </CardContent>
        </Card>
    )
}

const AnalyticsView = ({ setActiveView, analyticsData, averageProduction }: { setActiveView: (view: string) => void, analyticsData: { name: string, value: number }[], averageProduction: Record<string, number> }) => (
    <div>
        <Button onClick={() => setActiveView('dashboard')} variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Production Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={analyticsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={150}
                                dataKey="value"
                                nameKey="name"
                                label
                            >
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
                    <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(averageProduction).map(([name, value]) => (
                        <div key={name} className="flex justify-between items-center">
                            <span className="font-medium">{name} (Average)</span>
                            <span className="text-lg font-bold">{value.toFixed(2)} units</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
) 