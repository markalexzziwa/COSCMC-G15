import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
    { name: 'Total Farm Area', value: '15 Hectares' },
    { name: 'Number of Palm Trees', value: '2,350' },
    { name: 'Last Harvest Yield', value: '4.8 Tons' },
    { name: 'Growth Stage', value: 'Flowering' },
]

export function FarmStatsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-secondary">Farm Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {stats.map((stat) => (
                        <li key={stat.name} className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                            <p className="text-lg font-semibold">{stat.value}</p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
} 