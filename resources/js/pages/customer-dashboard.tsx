import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { products } from '@/lib/products'

export default function CustomerDashboard() {
    const [notification, setNotification] = useState<string | null>(null)

    useEffect(() => {
        setNotification("You're logged in as a Customer!")
        const timer = setTimeout(() => {
            setNotification(null)
        }, 4000) // Notification disappears after 4 seconds

        return () => clearTimeout(timer)
    }, [])

    return (
        <div style={{ backgroundColor: 'black' }}>
            <AppLayout>
                <Head title="Customer Dashboard" />

                {notification && (
                    <div className="fixed top-24 right-5 z-50 rounded-md bg-green-500 p-4 text-white shadow-lg animate-in fade-in-0 slide-in-from-top-5">
                        {notification}
                    </div>
                )}

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div
                            className="overflow-hidden shadow-sm sm:rounded-lg"
                            style={{ backgroundColor: '#FFF5F7' }}
                        >
                            <div className="p-6 text-gray-900">Order your favorite!</div>
                        </div>

                        <div className="mt-6">
                            <OrderProductsCard />
                        </div>
                    </div>
                </div>
            </AppLayout>
        </div>
    )
}

function OrderProductsCard() {
    const [quantities, setQuantities] = useState<Record<number, number>>({})

    const handleQuantityChange = (productId: number, quantity: string) => {
        const numQuantity = parseInt(quantity, 10)
        setQuantities(prev => ({
            ...prev,
            [productId]: isNaN(numQuantity) ? 0 : numQuantity,
        }))
    }

    const totalAmount = products.reduce((acc, product) => {
        const quantity = quantities[product.id] || 0
        return acc + product.price * quantity
    }, 0)

    const hasDiscount = Object.values(quantities).some(q => q > 1)
    const discountedAmount = hasDiscount ? totalAmount * 0.85 : totalAmount

    return (
        <Card style={{ backgroundColor: '#FFF5F7' }}>
            <CardHeader>
                <CardTitle>Order Products</CardTitle>
                <CardDescription>Select the quantity of products you want to order.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products.map(product => (
                        <div key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-12 w-12 rounded-md object-cover"
                                />
                                <div>
                                    <Label htmlFor={`product-${product.id}`} className="font-semibold">
                                        {product.name}
                                    </Label>
                                    <p className="text-sm text-gray-500">Ugx {product.price.toLocaleString()}</p>
                                </div>
                            </div>
                            <Input
                                id={`product-${product.id}`}
                                type="number"
                                min="0"
                                value={quantities[product.id] || ''}
                                onChange={e => handleQuantityChange(product.id, e.target.value)}
                                className="w-24"
                                placeholder="0"
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span>Ugx {totalAmount.toLocaleString()}</span>
                    </div>
                    {hasDiscount && (
                        <div className="flex justify-between mt-2 text-green-600 font-semibold">
                            <span>Discount (15%)</span>
                            <span>-Ugx {(totalAmount - discountedAmount).toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between mt-2 text-xl font-bold">
                        <span>Amount to Pay</span>
                        <span>Ugx {discountedAmount.toLocaleString()}</span>
                    </div>
                </div>
                <Button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white">Place Order</Button>
            </CardContent>
        </Card>
    )
} 