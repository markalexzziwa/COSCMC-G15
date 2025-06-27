import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts'
import { Home, BarChart2, PieChart as PieChartIcon, ArrowLeft } from 'lucide-react'

// Mock data for the chart
const productionData = [
    { date: '2024-07-01', 'Cooking Oil': 400, Shampoo: 240, Margarine: 300 },
    { date: '2024-07-02', 'Cooking Oil': 300, Shampoo: 139, Margarine: 450 },
    { date: '2024-07-03', 'Cooking Oil': 200, Shampoo: 980, Margarine: 200 },
    { date: '2024-07-04', 'Cooking Oil': 278, Shampoo: 390, Margarine: 350 },
    { date: '2024-07-05', 'Cooking Oil': 189, Shampoo: 480, Margarine: 250 },
    { date: '2024-07-06', 'Cooking Oil': 239, Shampoo: 380, Margarine: 280 },
    { date: '2024-07-07', 'Cooking Oil': 349, Shampoo: 430, Margarine: 210 },
]

const totalProduction = productionData.reduce((acc, curr) => {
    acc['Cooking Oil'] = (acc['Cooking Oil'] || 0) + curr['Cooking Oil']
    acc['Shampoo'] = (acc['Shampoo'] || 0) + curr['Shampoo']
    acc['Margarine'] = (acc['Margarine'] || 0) + curr['Margarine']
    return acc
}, {} as Record<string, number>)

const analyticsData = [
    { name: 'Cooking Oil', value: totalProduction['Cooking Oil'] },
    { name: 'Shampoo', value: totalProduction['Shampoo'] },
    { name: 'Margarine', value: totalProduction['Margarine'] },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

export default function ManufacturerDashboard() {
    const [notification, setNotification] = useState<string | null>(null)
    const [activeView, setActiveView] = useState('dashboard')

    useEffect(() => {
        setNotification('Welcome, Manufacturer!')
        const timer = setTimeout(() => {
            setNotification(null)
        }, 5000) // Notification disappears after 5 seconds
        return () => clearTimeout(timer)
    }, [])

    const renderView = () => {
        switch (activeView) {
            case 'chart':
                return <ChartView setActiveView={setActiveView} />
            case 'analytics':
                return <AnalyticsView setActiveView={setActiveView} />
            case 'dashboard':
            default:
                return <DashboardHome setActiveView={setActiveView} />
        }
    }

    return (
        <AppLayout>
            <Head title="Manufacturer Dashboard" />

            {notification && (
                <div className="fixed top-24 right-5 z-50 rounded-md bg-green-500 p-4 text-white shadow-lg animate-in fade-in-0 slide-in-from-top-5">
                    {notification}
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {renderView()}
            </div>
        </AppLayout>
    )
}

const DashboardHome = ({ setActiveView }: { setActiveView: (view: string) => void }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Manufacturer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
                title="Chart"
                description="Visualize production data over time."
                icon={<BarChart2 className="h-10 w-10 text-blue-500" />}
                onClick={() => setActiveView('chart')}
            />
            <DashboardCard
                title="Analytics"
                description="Analyze production distribution."
                icon={<PieChartIcon className="h-10 w-10 text-green-500" />}
                onClick={() => setActiveView('analytics')}
            />
            <Link href="/" className="block">
                <DashboardCard
                    title="Home"
                    description="Return to the main welcome page."
                    icon={<Home className="h-10 w-10 text-gray-500" />}
                />
            </Link>
        </div>
    </div>
)

const DashboardCard = ({ title, description, icon, onClick }: { title: string, description: string, icon: React.ReactNode, onClick?: () => void }) => (
    <Card onClick={onClick} className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
    </Card>
)

const ChartView = ({ setActiveView }: { setActiveView: (view: string) => void }) => (
    <div>
        <Button onClick={() => setActiveView('dashboard')} variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <Card>
            <CardHeader>
                <CardTitle>Production Chart</CardTitle>
                <CardDescription>Daily production quantities of different products.</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] w-full">
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
    </div>
)

const AnalyticsView = ({ setActiveView }: { setActiveView: (view: string) => void }) => (
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
                    {Object.entries(totalProduction).map(([name, value]) => (
                        <div key={name} className="flex justify-between items-center">
                            <span className="font-medium">{name}</span>
                            <span className="text-lg font-bold">{value.toLocaleString()} units</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
) 