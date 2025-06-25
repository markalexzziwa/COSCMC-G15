import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Head } from '@inertiajs/react'

// Placeholder data
const summary = {
    income: 12500,
    expenses: 4200,
    netProfit: 8300,
}

const incomeTransactions = [
    { id: 1, description: 'Sale of 4.8 Tons Palm Fruit', amount: 12500, date: '2024-06-28' },
]

const expenseTransactions = [
    { id: 1, description: 'Labor Costs - Harvesting', amount: 2500, date: '2024-06-27' },
    { id: 2, description: 'Transport to Mill', amount: 1000, date: '2024-06-28' },
    { id: 3, description: 'Fertilizer Purchase (NPK)', amount: 700, date: '2024-06-15' },
]

export default function FinancialsPage() {
    return (
        <AppLayout>
            <Head title="Expenditure & Income" />
            <div className="py-12" style={{ backgroundColor: '#374151' }}>
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    {/* Financial Summary Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Summary (This Season)</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
                            <div>
                                <p className="text-sm font-medium text-gray-300">Total Income</p>
                                <p className="text-2xl font-semibold" style={{ color: '#4A7C59' }}>${summary.income.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-300">Total Expenses</p>
                                <p className="text-2xl font-semibold" style={{ color: '#D95B43' }}>${summary.expenses.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-300">Net Profit</p>
                                <p className="text-2xl font-semibold" style={{ color: '#A8763E' }}>${summary.netProfit.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Income List Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {incomeTransactions.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b py-3">
                                    <div>
                                        <p>{item.description}</p>
                                        <p className="text-sm text-gray-500">{item.date}</p>
                                    </div>
                                    <p className="font-semibold" style={{ color: '#4A7C59' }}>+${item.amount.toLocaleString()}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Expenses List Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {expenseTransactions.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b py-3">
                                    <div>
                                        <p>{item.description}</p>
                                        <p className="text-sm text-gray-500">{item.date}</p>
                                    </div>
                                    <p className="font-semibold" style={{ color: '#D95B43' }}>-${item.amount.toLocaleString()}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
} 