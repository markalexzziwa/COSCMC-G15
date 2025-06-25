import AppLayout from '@/layouts/app-layout'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Head } from '@inertiajs/react'

const groves = [
    { id: 'A', name: 'Grove A', treeCount: 850, health: 'Excellent', lastPruned: '2024-05-10' },
    { id: 'B', name: 'Grove B', treeCount: 700, health: 'Good', lastPruned: '2024-04-22' },
    { id: 'C', name: 'Grove C', treeCount: 800, health: 'Fair', lastPruned: '2024-05-18' },
]

function getHealthBadgeColor(health: string) {
    switch (health) {
        case 'Excellent':
            return 'bg-primary/20 text-primary-foreground hover:bg-primary/30'
        case 'Good':
            return 'bg-accent/20 text-accent-foreground hover:bg-accent/30'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

function getHealthTextColor(health: string) {
    switch (health) {
        case 'Excellent':
            return '#4A7C59';
        case 'Good':
            return '#A8763E'; // Using secondary for better contrast on the accent bg
        default:
            return '#374151'; // A dark gray
    }
}

export default function GrovesPage() {
    return (
        <AppLayout>
            <Head title="Groves Management" />
            <div className="py-12" style={{ backgroundColor: '#374151' }}>
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold" style={{ color: '#E5E7EB' }}>Groves</h1>
                        {/* A button to add a new grove would go here */}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {groves.map((grove) => (
                            <Card key={grove.id}>
                                <CardHeader>
                                    <CardTitle>{grove.name}</CardTitle>
                                    <CardDescription>Last pruned: {grove.lastPruned}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-500">Tree Count</span>
                                        <span className="font-semibold">{grove.treeCount}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-500">Health Status</span>
                                        <Badge className={getHealthBadgeColor(grove.health)}>
                                            <span style={{ color: getHealthTextColor(grove.health) }}>{grove.health}</span>
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
} 