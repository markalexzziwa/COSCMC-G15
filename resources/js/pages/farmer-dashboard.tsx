import { FarmStatsCard } from '@/components/farm-stats-card'
import { HarvestSummaryCard } from '@/components/harvest-summary-card'
import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'

export default function FarmerDashboard() {
    return (
        <AppLayout>
            <Head title="Farmer Dashboard" />

            <div className="py-12" style={{ backgroundColor: '#374151' }}>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <HarvestSummaryCard />
                        </div>
                        <div className="lg:col-span-1">
                            <FarmStatsCard />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
} 