import { useState } from 'react'
import { FarmStatsCard } from '@/components/farm-stats-card'
import { HarvestSummaryCard } from '@/components/harvest-summary-card'
import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function FarmerDashboard() {
    const [showHarvests, setShowHarvests] = useState(false);
    const [showFarmSpec, setShowFarmSpec] = useState(false);
    return (
        <AppLayout>
            <Head title="Farmer Dashboard" />

            {!showHarvests && !showFarmSpec ? (
                <div className="py-12" style={{ backgroundColor: '#374151' }}>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:grid-rows-2">
                            <div className="h-full">
                                <Card onClick={() => window.location.href = '/'} className="hover:shadow-lg transition-shadow cursor-pointer bg-yellow-50 h-full flex flex-col justify-center items-center">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 w-full">
                                        <CardTitle className="text-2xl font-bold text-purple-800">Home</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-500">Go to the welcome page</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="h-full">
                                <Card onClick={() => setShowHarvests(true)} className="bg-white/80 rounded-xl shadow-lg p-6 backdrop-blur-md h-full flex flex-col justify-center cursor-pointer hover:shadow-xl transition">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold mb-4">Previous Harvests</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-500">Click to view recent harvests</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="h-full">
                                <Card onClick={() => setShowFarmSpec(true)} className="bg-white/80 rounded-xl shadow-lg p-6 backdrop-blur-md h-full flex flex-col justify-center cursor-pointer hover:shadow-xl transition">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold mb-4">Farm Specification</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-500">Click to view farm specification</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="h-full">
                                <Card className="bg-white/60 rounded-xl shadow p-6 h-full flex flex-col justify-center items-center text-gray-400">Empty</Card>
                            </div>
                        </div>
                    </div>
                </div>
            ) : showHarvests ? (
                <div className="fixed inset-0 z-50 flex flex-col bg-white min-h-screen">
                    <div className="flex items-center p-4 border-b">
                        <button onClick={() => setShowHarvests(false)} className="text-2xl text-gray-700 hover:text-black mr-4">
                            &#8592;
                        </button>
                        <h2 className="text-2xl font-bold text-center flex-1">Recent Harvests</h2>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-full max-w-2xl p-8">
                            <HarvestSummaryCard />
                        </div>
                    </div>
                </div>
            ) : showFarmSpec ? (
                <div className="fixed inset-0 z-50 flex flex-col bg-white min-h-screen">
                    <div className="flex items-center p-4 border-b">
                        <button onClick={() => setShowFarmSpec(false)} className="text-2xl text-gray-700 hover:text-black mr-4">
                            &#8592;
                        </button>
                        <h2 className="text-2xl font-bold text-center flex-1">Farm Specification</h2>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-full max-w-2xl p-8">
                            <FarmStatsCard />
                        </div>
                    </div>
                </div>
            ) : null}
        </AppLayout>
    )
} 