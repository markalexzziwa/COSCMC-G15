import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const harvests = [
    { id: 1, grove: 'Grove A', weight: 520, date: '2024-06-26' },
    { id: 2, grove: 'Grove B', weight: 710, date: '2024-06-25' },
    { id: 3, grove: 'Grove A', weight: 480, date: '2024-06-24' },
    { id: 4, grove: 'Grove C', weight: 650, date: '2024-06-23' },
]

export function HarvestSummaryCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-primary">Recent Harvests</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="divide-y">
                    {harvests.map((harvest) => (
                        <li key={harvest.id} className="flex items-center justify-between py-3">
                            <p className="text-sm text-gray-500">{harvest.date}</p>
                            <p className="text-lg font-medium">{harvest.weight} kg</p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
} 