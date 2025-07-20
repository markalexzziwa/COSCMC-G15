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
import { Send, ShoppingCart } from 'lucide-react';

function OrderStatisticsCards() {
    const [stats, setStats] = useState({
        ordersWithDiscount: 0,
        ordersWithoutDiscount: 0,
        totalMoneySaved: 0
    });

    useEffect(() => {
        const loadOrderStats = () => {
            if (typeof window !== 'undefined') {
                const savedOrders = localStorage.getItem('customerOrders');
                if (savedOrders) {
                    const orders = JSON.parse(savedOrders);
                    
                    let withDiscount = 0;
                    let withoutDiscount = 0;
                    let totalSaved = 0;
                    
                    orders.forEach((order: any) => {
                        if (order.discountedAmount < order.total) {
                            withDiscount++;
                            totalSaved += (order.total - order.discountedAmount);
                        } else {
                            withoutDiscount++;
                        }
                    });
                    
                    setStats({
                        ordersWithDiscount: withDiscount,
                        ordersWithoutDiscount: withoutDiscount,
                        totalMoneySaved: totalSaved
                    });
                }
            }
        };

        loadOrderStats();
        
        // Listen for changes in localStorage
        const handleStorageChange = () => {
            loadOrderStats();
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageChange', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageChange', handleStorageChange);
        };
    }, []);

    return (
        <Card style={{ backgroundColor: '#F8F9FA' }}>
            <CardHeader>
                <CardTitle>Order Statistics</CardTitle>
                <CardDescription>Your order history and savings overview</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Orders with Discount Card */}
                    <div className="rounded-lg bg-green-100 p-6 shadow-lg dark:bg-green-900">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                                {stats.ordersWithDiscount}
                            </div>
                            <div className="mt-2 text-lg font-semibold text-green-800 dark:text-green-200">
                                Orders with Discount
                            </div>
                            <div className="mt-1 text-sm text-green-600 dark:text-green-300">
                                Orders that received 15% discount
                            </div>
                        </div>
                    </div>

                    {/* Orders without Discount Card */}
                    <div className="rounded-lg bg-blue-100 p-6 shadow-lg dark:bg-blue-900">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.ordersWithoutDiscount}
                            </div>
                            <div className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
                                Orders without Discount
                            </div>
                            <div className="mt-1 text-sm text-blue-600 dark:text-blue-300">
                                Orders with single item purchases
                            </div>
                        </div>
                    </div>

                    {/* Total Money Saved Card */}
                    <div className="rounded-lg bg-purple-100 p-6 shadow-lg dark:bg-purple-900">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                                Ugx {stats.totalMoneySaved.toLocaleString()}
                            </div>
                            <div className="mt-2 text-lg font-semibold text-purple-800 dark:text-purple-200">
                                Total Money Saved
                            </div>
                            <div className="mt-1 text-sm text-purple-600 dark:text-purple-300">
                                Customer savings from discounts
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

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
                <div className="w-full flex flex-col items-center justify-center py-8 bg-pink-50 border-b border-yellow-300 mb-8 rounded-xl shadow">
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
                            <OrderStatisticsCards />
                        </div>
                        <div className="mt-10">
                            <OrderProductsCard />
                        </div>
                        <div className="mt-10">
                            <OrderStatusCard />
                        </div>
                        {/* CustomerChatCard removed */}
                    </div>
                </div>
            </AppLayout>
        </div>
    )
}

function getCustomerClass(total: number) {
    if (total < 75000) return 'Bronze';
    if (total < 195000) return 'Silver';
    return 'Gold';
}

function OrderProductsCard() {
    const [quantities, setQuantities] = useState<Record<number, number>>({})
    const [showInput, setShowInput] = useState<Record<number, boolean>>({});
    const [orderMessage, setOrderMessage] = useState<string | null>(null);

    const handleQuantityChange = (productId: number, quantity: string) => {
        const numQuantity = parseInt(quantity, 10)
        setQuantities(prev => ({
            ...prev,
            [productId]: isNaN(numQuantity) ? 0 : numQuantity,
        }))
    }

    const handleShowInput = (productId: number) => {
        setShowInput(prev => ({ ...prev, [productId]: true }));
    };
    const handleHideInput = (productId: number) => {
        setShowInput(prev => ({ ...prev, [productId]: false }));
        setQuantities(prev => ({ ...prev, [productId]: 0 }));
    };

    const totalAmount = products.reduce((acc, product) => {
        const quantity = quantities[product.id] || 0
        return acc + product.price * quantity
    }, 0)

    const hasDiscount = Object.values(quantities).some(q => q > 1)
    const discountedAmount = hasDiscount ? totalAmount * 0.85 : totalAmount

    const customerClass = getCustomerClass(totalAmount);

    const handlePlaceOrder = () => {
        const orderItems = products
            .filter(product => (quantities[product.id] || 0) > 0)
            .map(product => ({
                id: product.id,
                name: product.name,
                quantity: quantities[product.id],
                price: product.price,
            }));
        if (orderItems.length === 0) {
            setOrderMessage('Please add at least one product to your order.');
            setTimeout(() => setOrderMessage(null), 3000);
            return;
        }
        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: orderItems,
            total: totalAmount,
            discountedAmount,
        };
        // Save to localStorage
        const existingOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('customerOrders', JSON.stringify(existingOrders));
        setOrderMessage('Order placed successfully!');
        setQuantities({});
        setShowInput({});
        setTimeout(() => setOrderMessage(null), 3000);
    };

    return (
        <Card style={{ backgroundColor: '#FFF5F7' }}>
            <CardHeader>
                <CardTitle>Order Products</CardTitle>
                <CardDescription>Select the quantity of products you want to order.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map(product => {
                        const quantity = quantities[product.id] || 0;
                        const inputVisible = showInput[product.id] || quantity > 0;
                        return (
                            <Card key={product.id} className="flex flex-col items-center p-4">
                                <CardHeader className="flex flex-col items-center">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-24 w-24 rounded-md object-cover mb-2"
                                    />
                                    <CardTitle className="text-lg font-bold text-center">{product.name}</CardTitle>
                                    <CardDescription className="text-center text-gray-500">Ugx {product.price.toLocaleString()}</CardDescription>
                                </CardHeader>
                                <CardContent className="w-full flex flex-col items-center">
                                    {inputVisible ? (
                                        <Input
                                            id={`product-${product.id}`}
                                            type="number"
                                            min="0"
                                            value={quantity === 0 ? '' : quantity}
                                            onChange={e => {
                                                handleQuantityChange(product.id, e.target.value);
                                                if (e.target.value === '' || e.target.value === '0') {
                                                    handleHideInput(product.id);
                                                }
                                            }}
                                            className="w-24 text-center"
                                            placeholder="0"
                                            autoFocus
                                        />
                                    ) : (
                                        <Button
                                            className="w-24 text-center bg-blue-600 text-white hover:bg-blue-900 flex items-center justify-center gap-2"
                                            onClick={() => handleShowInput(product.id)}
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            add
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span>Ugx {totalAmount.toLocaleString()}</span>
                    </div>
                    {/* Show customer class */}
                    <div className="flex justify-between mt-2">
                        <span>Customer Class</span>
                        <span
                            className={`px-3 py-1 rounded-full font-bold text-white ${
                                customerClass === 'Gold'
                                    ? 'bg-yellow-500'
                                    : customerClass === 'Silver'
                                    ? 'bg-gray-400'
                                    : 'bg-orange-700'
                            }`}
                        >
                            {customerClass}
                        </span>
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
                    {orderMessage && (
                        <div className="mt-4 text-center text-green-700 font-bold">{orderMessage}</div>
                    )}
                    <Button
                        className={`mt-6 w-full text-white font-bold rounded-full py-3 px-6 transition-colors duration-200
                            ${customerClass === 'Gold' ? 'bg-yellow-900 hover:bg-yellow-800' : customerClass === 'Silver' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-orange-900 hover:bg-orange-800'}
                        `}
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function OrderStatusCard() {
    type OrderItem = { id: number; name: string; quantity: number; price: number };
    type Order = {
        id: number;
        date: string;
        total: number;
        discountedAmount: number;
        items: OrderItem[];
        status?: string;
    };
    const [orders, setOrders] = useState<Order[]>([])
    
    useEffect(() => {
        const stored = localStorage.getItem('customerOrders');
        if (stored) {
            setOrders(JSON.parse(stored));
        }
    }, []);

    const updateOrderStatus = (orderId: number, status: string) => {
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('customerOrders', JSON.stringify(updatedOrders));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'placed':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'received':
                return 'bg-yellow-500 hover:bg-yellow-600';
            case 'completed':
                return 'bg-green-500 hover:bg-green-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    return (
        <Card style={{ backgroundColor: '#F0F7FF' }}>
            <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>View your recent orders and their status.</CardDescription>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <div>No orders found.</div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: Order) => (
                            <div key={order.id} className="border-b pb-4">
                                <div className="flex justify-between font-semibold">
                                    <span>Order Date:</span>
                                    <span>{new Date(order.date).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span>Ugx {Number(order.total).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Amount Paid:</span>
                                    <span>Ugx {Number(order.discountedAmount).toLocaleString()}</span>
                                </div>
                                {order.discountedAmount < order.total && (
                                    <div className="flex justify-between text-green-700 font-semibold">
                                        <span>Discounted Amount:</span>
                                        <span>Ugx {Number(order.discountedAmount).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="mt-2">
                                    <div className="font-semibold">Products:</div>
                                    <ul className="list-disc list-inside">
                                        {order.items.map((item: OrderItem) => (
                                            <li key={item.id}>
                                                {item.name} x {item.quantity} @ Ugx {item.price.toLocaleString()}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="mt-4 flex justify-between items-center">
                                    <div className="flex justify-between w-full">
                                        <Button
                                            onClick={() => updateOrderStatus(order.id, 'placed')}
                                            className="px-4 py-2 text-white rounded-md transition-colors bg-green-600 hover:bg-green-700 flex items-center justify-center w-1/3 mx-1"
                                        >
                                            <span className="mr-2">✔</span>Placed
                                        </Button>
                                        <Button
                                            onClick={() => updateOrderStatus(order.id, 'received')}
                                            className="px-4 py-2 text-white rounded-md transition-colors bg-red-600 hover:bg-red-700 flex items-center justify-center w-1/3 mx-1"
                                        >
                                            <span className="mr-2">✗</span>Received
                                        </Button>
                                        <Button
                                            onClick={() => updateOrderStatus(order.id, 'completed')}
                                            className="px-4 py-2 text-white rounded-md transition-colors bg-red-600 hover:bg-red-700 flex items-center justify-center w-1/3 mx-1"
                                        >
                                            <span className="mr-2">✗</span>Order Completed
                                        </Button>
                                    </div>
                                    {order.status && (
                                        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 