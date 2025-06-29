import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useInventoryChatStore from '@/store/useInventoryChatStore'
import { Send } from 'lucide-react'

export default function InventoryManagerDashboard() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 4000)

        return () => clearTimeout(timer)
    }, [])
    return (
        <AppLayout>
            <Head title="Inventory Manager Dashboard" />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Inventory Manager Dashboard</h1>
                <ChatCard />
            </div>
        </AppLayout>
    )
}

const ChatCard = () => {
    const { messages, addMessage } = useInventoryChatStore();
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        addMessage({
            sender: 'Inventory Manager',
            text: newMessage,
            timestamp: new Date().toISOString(),
        });

        setNewMessage('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manufacturer Chat</CardTitle>
                <CardDescription>View and send messages to the manufacturer.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 h-64 overflow-y-auto mb-4 p-4 border rounded-md">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'Inventory Manager' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg ${message.sender === 'Inventory Manager' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                <p className="font-semibold">{message.sender}</p>
                                <p>{message.text}</p>
                                <p className="text-xs mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <Button onClick={handleSendMessage} variant="info" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}; 