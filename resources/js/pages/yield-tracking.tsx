import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Head, useForm } from '@inertiajs/react'

export default function YieldTrackingPage() {
    const { data, setData, post, processing, errors } = useForm({
        harvest_date: '',
        expected_yield: '',
        actual_yield: '',
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // In a real application, you would post this to a controller
        // post(route('yield.store')); 
        console.log(data) // For now, we'll just log the data
    }

    return (
        <AppLayout>
            <Head title="Yield Tracking" />

            <div className="py-12" style={{ backgroundColor: '#374151' }}>
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Track Harvest Yield</CardTitle>
                            <CardDescription>Enter the expected and actual yield for a specific harvest.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="harvest_date">Harvest Date</Label>
                                    <Input
                                        id="harvest_date"
                                        type="date"
                                        value={data.harvest_date}
                                        onChange={(e) => setData('harvest_date', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    {/* You can add an InputError component here */}
                                </div>

                                <div>
                                    <Label htmlFor="expected_yield">Expected Yield (kg)</Label>
                                    <Input
                                        id="expected_yield"
                                        type="number"
                                        value={data.expected_yield}
                                        onChange={(e) => setData('expected_yield', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="actual_yield">Actual Yield (kg)</Label>
                                    <Input
                                        id="actual_yield"
                                        type="number"
                                        value={data.actual_yield}
                                        onChange={(e) => setData('actual_yield', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                </div>

                                <div className="flex items-center justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Save Yield
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
} 