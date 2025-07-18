import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { products } from '@/lib/products'
import { Link } from '@inertiajs/react';
import useChatStore from '@/store/useChatStore';
import { Send } from 'lucide-react';

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
        <div>
            <AppLayout>
                <Head title="Customer Dashboard" />

                {/* Shop Now Banner */}
                <div className="w-full flex flex-col items-center justify-center py-8 bg-yellow-100 border-b border-yellow-300 mb-8 rounded-xl shadow">
                    <h1 className="text-4xl font-extrabold text-black mb-2">Shop Now!</h1>
                    <p className="text-lg text-black">Order your favorite!</p>
                </div>

                {notification && (
                    <div className="fixed top-24 right-5 z-50 rounded-md bg-green-500 p-4 text-white shadow-lg animate-in fade-in-0 slide-in-from-top-5">
                        {notification}
                    </div>
                )}

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="mt-6">
                            <OrderProductsCard />
                        </div>
                        {/* CustomerChatCard removed */}
                    </div>
                </div>
            </AppLayout>
        </div>
    )
}

function OrderProductsCard() {
    const [quantities, setQuantities] = useState<Record<number, number>>({})
    // Remove loading and orderMessage state

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

    // Remove handlePlaceOrder and all related fetch/notification logic

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
                {/* Remove orderMessage and disable logic */}
                <Button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                    Place Order
                </Button>
            </CardContent>
        </Card>
    )
}

function OrderStatusCard() {
    type OrderItem = { id: number; quantity: number; product?: { name: string } };
    type Order = {
        id: number;
        created_at: string;
        total_price: number;
        discount_price: number;
        items: OrderItem[];
    };
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string|null>(null)

    useEffect(() => {
        fetch('/orders/status', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setOrders(data.orders || [])
                setLoading(false)
            })
            .catch(() => {
                setError('Failed to load order status.')
                setLoading(false)
            })
    }, [])

    return (
        <Card style={{ backgroundColor: '#F0F7FF' }}>
            <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>View your recent orders and their status.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="text-red-600">{error}</div>
                ) : orders.length === 0 ? (
                    <div>No orders found.</div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: Order) => (
                            <div key={order.id} className="border-b pb-4">
                                <div className="flex justify-between font-semibold">
                                    <span>Order Date:</span>
                                    <span>{new Date(order.created_at).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span>Ugx {Number(order.total_price).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount:</span>
                                    <span>Ugx {Number(order.discount_price).toLocaleString()}</span>
                                </div>
                                <div className="mt-2">
                                    <div className="font-semibold">Products:</div>
                                    <ul className="list-disc list-inside">
                                        {order.items.map((item: OrderItem) => (
                                            <li key={item.id}>
                                                {item.product?.name || 'Product'} x {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 