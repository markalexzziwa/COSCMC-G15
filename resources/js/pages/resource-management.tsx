import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Head } from '@inertiajs/react'

// Placeholder data
const fertilizerUsage = [
    { id: 1, name: 'NPK 15-15-15', amount: '50 kg', date: '2024-06-15' },
    { id: 2, name: 'Urea', amount: '25 kg', date: '2024-06-20' },
]

const stockLevels = [
    { id: 1, item: 'Palm Seeds', quantity: '200 units' },
    { id: 2, item: 'Fertilizer NPK', quantity: '5 bags' },
    { id: 3, item: 'Pruning Shears', quantity: '10 units' },
]

const irrigationSchedule = [
    { id: 1, grove: 'Grove A', day: 'Monday', time: '06:00 AM', duration: '2 hours' },
    { id: 2, grove: 'Grove B', day: 'Wednesday', time: '06:00 AM', duration: '2 hours' },
    { id: 3, grove: 'Grove C', day: 'Friday', time: '06:00 AM', duration: '2 hours' },
]

export default function ResourceManagementPage() {
    return (
        <AppLayout>
            <Head title="Resource Management" />
            <div className="py-12" style={{ backgroundColor: '#374151' }}>
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    {/* Fertilizer & Pesticide Usage Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: '#90EE90' }}>Fertilizer & Pesticide Usage</CardTitle>
                            <CardDescription>A log of recently used resources.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Header */}
                            <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600 border-b pb-2">
                                <div>Product Name</div>
                                <div>Amount Used</div>
                                <div>Date</div>
                            </div>
                            {/* Body */}
                            <div className="space-y-3">
                                {fertilizerUsage.map((item) => (
                                    <div key={item.id} className="grid grid-cols-3 gap-4">
                                        <div>{item.name}</div>
                                        <div>{item.amount}</div>
                                        <div>{item.date}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Levels Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: '#ADD8E6' }}>Stock Levels</CardTitle>
                            <CardDescription>Current inventory of tools, seeds, and fertilizers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-2 gap-4 font-semibold text-sm text-gray-600 border-b pb-2">
                                <div>Item</div>
                                <div>Quantity</div>
                            </div>
                             <div className="space-y-3">
                                {stockLevels.map((item) => (
                                    <div key={item.id} className="grid grid-cols-2 gap-4">
                                        <div>{item.item}</div>
                                        <div>{item.quantity}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Irrigation Schedule Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: '#FFD700' }}>Irrigation Schedule</CardTitle>
                            <CardDescription>Weekly watering plan for the groves.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-600 border-b pb-2">
                                <div>Grove</div>
                                <div>Day</div>
                                <div>Time</div>
                                <div>Duration</div>
                            </div>
                             <div className="space-y-3">
                                {irrigationSchedule.map((item) => (
                                    <div key={item.id} className="grid grid-cols-4 gap-4">
                                        <div>{item.grove}</div>
                                        <div>{item.day}</div>
                                        <div>{item.time}</div>
                                        <div>{item.duration}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
} 