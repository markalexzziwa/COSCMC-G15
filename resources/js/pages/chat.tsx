import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Inbox, FileText, AlertOctagon, Trash2 } from 'lucide-react';
import useChatStore, { MessageCategory } from '@/store/useChatStore';
import useInventoryChatStore from '@/store/useInventoryChatStore';
import useStockStore from '@/store/useStockStore';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

const userTypes = [
    'Manufacturer',
    'Factory Store',
    'Inventory Manager',
    'Retail',
    'Distributor',
    'Admin',
    'Customer',
    'Farmer',
    'Unofficial Vendor',
];

// Simple in-memory store for admin chat (for demo; in real app, use global state or backend)
const adminCategories = [
    { key: 'inbox', label: 'inbox', icon: <Inbox size={16} /> },
    { key: 'sent', label: 'sent', icon: <Send size={16} /> },
    { key: 'draft', label: 'draft', icon: <FileText size={16} /> },
    { key: 'spam', label: 'spam', icon: <AlertOctagon size={16} /> },
    { key: 'trash', label: 'trash', icon: <Trash2 size={16} /> },
] as const;
type AdminCategory = typeof adminCategories[number]['key'];

type AdminMessage = {
    id: string;
    sender: string;
    recipient: string;
    text: string;
    timestamp: string;
    category: AdminCategory;
};

const useAdminChatStore = () => {
    const [messages, setMessages] = React.useState<AdminMessage[]>([]);
    const addMessage = (msg: { sender: string, recipient: string, text: string }) => {
        setMessages(prev => [
            ...prev,
            {
                id: Math.random().toString(36).slice(2),
                sender: msg.sender,
                recipient: msg.recipient,
                text: msg.text,
                timestamp: new Date().toISOString(),
                category: msg.sender === 'Admin' ? 'sent' : 'inbox',
            },
        ]);
    };
    const moveMessage = (id: string, category: AdminCategory) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, category } : m));
    };
    return { messages, addMessage, moveMessage };
};

const AdminChat = () => {
    const { messages, addMessage, moveMessage } = useAdminChatStore();
    const [newMessage, setNewMessage] = React.useState('');
    const [recipient, setRecipient] = React.useState(userTypes[0]);
    const [activeCategory, setActiveCategory] = React.useState<AdminCategory>('inbox');

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        addMessage({ sender: 'Admin', recipient, text: newMessage });
        setNewMessage('');
    };

    // Filter messages by category
    const filteredMessages = messages.filter((message) => message.category === activeCategory);

    return (
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="text-white px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(90deg, rgba(82, 122, 154, 0.8) 0%, rgba(75, 80, 232, 0.7) 100%)' }}>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(82, 122, 154, 0.9)' }}>
                        <span className="text-white font-semibold text-sm">AD</span>
                    </div>
                    <div>
                        <h3 className="font-semibold">Admin Chat</h3>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>greetings, chat now</p>
                    </div>
                </div>
            </div>
            <div className="flex">
                {/* Vertical Category Navigation */}
                <div className="w-48 bg-gray-50 border-r">
                    <nav className="p-4 space-y-2">
                        {adminCategories.map((cat) => (
                            <Button
                                key={cat.key}
                                variant={activeCategory === cat.key ? 'default' : 'ghost'}
                                size="sm"
                                className={`w-full justify-start text-sm capitalize ${activeCategory === cat.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                                onClick={() => setActiveCategory(cat.key as AdminCategory)}
                            >
                                {cat.icon}
                                <span className="ml-2 capitalize">{cat.label}</span>
                            </Button>
                        ))}
                    </nav>
                </div>
                {/* Chat Content */}
                <div className="flex-1 flex flex-col">
                    <div className="h-96 bg-gray-100 p-4 overflow-y-auto">
                        {filteredMessages.length > 0 ? (
                            <div className="space-y-3">
                                {filteredMessages.map((message) => (
                                    <div key={message.id} className="group">
                                        <div className={`flex ${message.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                                                    message.sender === 'Admin'
                                                        ? 'text-white rounded-br-none'
                                                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                                }`}
                                                style={message.sender === 'Admin' ? { background: 'linear-gradient(90deg, rgba(82, 122, 154, 0.9) 0%, rgba(75, 80, 232, 0.8) 100%)' } : {}}
                                            >
                                                <p className="text-xs font-semibold mb-1">{message.sender} ➔ {message.recipient}</p>
                                                <p className="text-sm">{message.text}</p>
                                                <p className={`text-xs mt-1 ${message.sender === 'Admin' ? 'text-white/80' : 'text-gray-500'}`}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                        <div className="hidden group-hover:flex justify-end space-x-1 mt-1">
                                            {activeCategory !== 'trash' && <Button variant="outline" size="sm" onClick={() => moveMessage(message.id, 'trash')}>Trash</Button>}
                                            {activeCategory !== 'spam' && <Button variant="outline" size="sm" onClick={() => moveMessage(message.id, 'spam')}>Spam</Button>}
                                            {activeCategory !== 'draft' && <Button variant="outline" size="sm" onClick={() => moveMessage(message.id, 'draft')}>Draft</Button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-gray-500">
                                    <p>No messages yet.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-4 border-t">
                        <div className="flex space-x-2 items-center">
                            <select
                                value={recipient}
                                onChange={e => setRecipient(e.target.value)}
                                className="rounded-lg border-gray-300 h-12 px-3 text-base"
                            >
                                {userTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <Input
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 rounded-full border-gray-300 h-12"
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button
                                onClick={handleSendMessage}
                                className="rounded-full p-2 h-12"
                                style={{ background: 'linear-gradient(90deg, rgba(82, 122, 154, 0.9) 0%, rgba(75, 80, 232, 0.8) 100%)' }}
                                disabled={!newMessage.trim()}
                            >
                                <Send className="h-5 w-5 text-white" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function CombinedFactoryStoreChatCard() {
    const [activeChat, setActiveChat] = useState<'manufacturer' | 'distributor'>('manufacturer');
    const [manufacturerMessages, setManufacturerMessages] = useState([
        { sender: 'Manufacturer', text: 'Welcome to the chat! How can I help you?', timestamp: new Date().toISOString() }
    ]);
    const [distributorMessages, setDistributorMessages] = useState([
        { sender: 'Distributor', text: 'Hello Factory Store! Ready for the next shipment?', timestamp: new Date().toISOString() }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const msg = {
            sender: 'Factory Store',
            text: newMessage,
            timestamp: new Date().toISOString(),
        };
        if (activeChat === 'manufacturer') {
            setManufacturerMessages(prev => [...prev, msg]);
            setIsReplying(true);
            setTimeout(() => {
                setManufacturerMessages(prev => [...prev, {
                    sender: 'Manufacturer',
                    text: 'Thank you for your message! We will assist you shortly.',
                    timestamp: new Date().toISOString(),
                }]);
                setIsReplying(false);
            }, 1200);
        } else {
            setDistributorMessages(prev => [...prev, msg]);
            setIsReplying(true);
            setTimeout(() => {
                setDistributorMessages(prev => [...prev, {
                    sender: 'Distributor',
                    text: 'Thank you for your message! We will coordinate with you soon.',
                    timestamp: new Date().toISOString(),
                }]);
                setIsReplying(false);
            }, 1200);
        }
        setNewMessage('');
    };

    const messages = activeChat === 'manufacturer' ? manufacturerMessages : distributorMessages;
    const chatTitle = activeChat === 'manufacturer' ? 'Manufacturer' : 'Distributor';
    const chatDescription = activeChat === 'manufacturer'
        ? 'Chat directly with the manufacturer for supply and support.'
        : 'Chat directly with the distributor for logistics and coordination.';

    return (
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="text-white px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(90deg, rgba(82, 122, 154, 0.8) 0%, rgba(75, 80, 232, 0.7) 100%)' }}>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(82, 122, 154, 0.9)' }}>
                        <span className="text-white font-semibold text-sm">FS</span>
                    </div>
                    <div>
                        <h3 className="font-semibold">Factory Store Chat</h3>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{chatDescription}</p>
                    </div>
                </div>
                {/* Chat selection toggle */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => setActiveChat('manufacturer')}
                        variant={activeChat === 'manufacturer' ? 'default' : 'ghost'}
                        size="sm"
                        className={activeChat === 'manufacturer' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}
                    >
                        Manufacturer
                    </Button>
                    <Button
                        onClick={() => setActiveChat('distributor')}
                        variant={activeChat === 'distributor' ? 'default' : 'ghost'}
                        size="sm"
                        className={activeChat === 'distributor' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border'}
                    >
                        Distributor
                    </Button>
                </div>
            </div>
            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50">
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {messages.map((message, idx) => (
                        <div key={idx} className={`flex ${message.sender === 'Factory Store' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm shadow-sm ${
                                    message.sender === 'Factory Store'
                                        ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 rounded-bl-none border'
                                }`}
                                style={message.sender === 'Factory Store' ? { background: 'linear-gradient(90deg, #ec4899 0%, #f472b6 100%)' } : {}}
                            >
                                <div className="font-semibold mb-1">{message.sender}</div>
                                <div>{message.text}</div>
                                <div className="text-xs mt-1 text-right text-gray-300">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </div>
                    ))}
                    {isReplying && (
                        <div className="flex justify-start">
                            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-black opacity-70">
                                <div className="font-semibold mb-1">{chatTitle}</div>
                                <div className="italic">Typing...</div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Input Area */}
                <div className="bg-white p-4 border-t flex items-center gap-2 sticky bottom-0 z-20">
                    <Input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder={`Type your message to the ${chatTitle.toLowerCase()}...`}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        disabled={isReplying}
                        className="flex-1 rounded-full border-gray-300 h-12"
                    />
                    <Button
                        onClick={handleSendMessage}
                        className="rounded-full p-2 h-12"
                        style={{ background: 'linear-gradient(90deg, rgba(82, 122, 154, 0.9) 0%, rgba(75, 80, 232, 0.8) 100%)' }}
                        disabled={!newMessage.trim() || isReplying}
                    >
                        <Send className="h-5 w-5 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function getDashboardChat(dashboard: string) {
    switch (dashboard) {
        case 'manufacturer':
            return <ManufacturerChat />;
        case 'retail':
            return (
                <div className="bg-green-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Retail Chat</h2>
                    <p>Chat with customers, distributors, and support here.</p>
                </div>
            );
        case 'distributor':
            return (
                <div className="bg-yellow-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Distributor Chat</h2>
                    <p>Chat with retail, inventory, and logistics here.</p>
                </div>
            );
        case 'admin':
            return <AdminChat />;
        case 'customer':
            return <CustomerRetailerChat />;
        case 'factory-store':
            return <CombinedFactoryStoreChatCard />;
        case 'farmer':
            return (
                <div className="bg-orange-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Farmer Chat</h2>
                    <p>Chat with inventory manager, support, and other farmers here.</p>
                </div>
            );
        case 'inventory-manager':
            return (
                <div className="bg-teal-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Inventory Manager Chat</h2>
                    <p>Chat with factory store, manufacturer, and distributors here.</p>
                </div>
            );
        case 'unofficial-vendor':
            return (
                <div className="bg-gray-100 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Unofficial Vendor Chat</h2>
                    <p>Chat with admin, support, and track your application here.</p>
                </div>
            );
        default:
            return (
                <div className="bg-gray-50 p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">General Chat</h2>
                    <p>General chat content. Log in as a specific user to see a tailored chat experience.</p>
                </div>
            );
    }
}

const ManufacturerChat = () => {
    const {
        messages: factoryStoreMessages,
        addMessage: addFactoryStoreMessage,
        moveMessage: moveFactoryStoreMessage,
    } = useChatStore();
    const {
        messages: inventoryManagerMessages,
        addMessage: addInventoryManagerMessage,
        moveMessage: moveInventoryManagerMessage,
    } = useInventoryChatStore();

    const [activeChat, setActiveChat] = useState<'factoryStore' | 'inventoryManager'>('factoryStore');
    const [activeCategory, setActiveCategory] = useState<MessageCategory>('inbox');
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const messagePayload = {
            sender: 'Manufacturer' as const,
            text: newMessage,
            timestamp: new Date().toISOString(),
        };

        if (activeChat === 'factoryStore') {
            addFactoryStoreMessage(messagePayload, 'sent');
        } else {
            addInventoryManagerMessage(messagePayload, 'sent');
        }

        setNewMessage('');
    };

    const currentMessages = activeChat === 'factoryStore' ? factoryStoreMessages : inventoryManagerMessages;
    const chatTitle = activeChat === 'factoryStore' ? 'Factory Store' : 'Inventory Manager';
    const moveMessage = activeChat === 'factoryStore' ? moveFactoryStoreMessage : moveInventoryManagerMessage;

    const filteredMessages = currentMessages.filter(m => {
        if (activeCategory === 'inbox') return m.category === 'inbox';
        if (activeCategory === 'sent') return m.category === 'sent';
        if (activeCategory === 'draft') return m.category === 'draft';
        if (activeCategory === 'spam') return m.category === 'spam';
        if (activeCategory === 'trash') return m.category === 'trash';
        return false;
    });

    return (
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* WhatsApp-style Header */}
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                            {activeChat === 'factoryStore' ? 'FS' : 'IM'}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold">{chatTitle}</h3>
                        <p className="text-xs text-blue-100">greetings, chat now</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button
                        onClick={() => setActiveChat('factoryStore')}
                        variant={activeChat === 'factoryStore' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={activeChat === 'factoryStore' ? 'text-white' : 'text-white hover:bg-white/20'}
                        style={activeChat === 'factoryStore' ? { background: 'rgba(75, 80, 232, 0.8)' } : {}}
                    >
                        Factory Store
                    </Button>
                    <Button
                        onClick={() => setActiveChat('inventoryManager')}
                        variant={activeChat === 'inventoryManager' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={activeChat === 'inventoryManager' ? 'text-white' : 'text-white hover:bg-white/20'}
                        style={activeChat === 'inventoryManager' ? { background: 'rgba(75, 80, 232, 0.8)' } : {}}
                    >
                        Inventory Manager
                    </Button>
                </div>
            </div>

            <div className="flex">
                {/* Vertical Category Navigation */}
                <div className="w-48 bg-gray-50 border-r">
                    <nav className="p-4 space-y-2">
                        <CategoryButton category="inbox" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<Inbox size={16} />} />
                        <CategoryButton category="sent" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<Send size={16} />} />
                        <CategoryButton category="draft" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<FileText size={16} />} />
                        <CategoryButton category="spam" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<AlertOctagon size={16} />} />
                        <CategoryButton category="trash" activeCategory={activeCategory} setActiveCategory={setActiveCategory} icon={<Trash2 size={16} />} />
                    </nav>
                </div>

                {/* Chat Content */}
                <div className="flex-1 flex flex-col">
                    {/* Messages Area */}
                    <div className="h-96 bg-gray-100 p-4 overflow-y-auto">
                        {filteredMessages.length > 0 ? (
                            <div className="space-y-3">
                                {filteredMessages.map((message) => (
                                    <div key={message.id} className="group">
                                        <div className={`flex ${message.sender === 'Manufacturer' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                                                message.sender === 'Manufacturer' 
                                                    ? 'text-white rounded-br-none' 
                                                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                            }`}
                                            style={message.sender === 'Manufacturer' ? { background: 'linear-gradient(90deg, rgba(82, 122, 154, 0.9) 0%, rgba(75, 80, 232, 0.8) 100%)' } : {}}
                                            >
                                                <p className="text-sm">{message.text}</p>
                                                <p className={`text-xs mt-1 ${message.sender === 'Manufacturer' ? 'text-white/80' : 'text-gray-500'}`}>
                                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="hidden group-hover:flex justify-end space-x-1 mt-1">
                                            {activeCategory !== 'trash' && (
                                                <Button variant="ghost" size="sm" onClick={() => moveMessage(message.id, 'trash')} className="text-gray-500 hover:text-red-500">
                                                    <Trash2 size={12} />
                                                </Button>
                                            )}
                                            {activeCategory !== 'spam' && (
                                                <Button variant="ghost" size="sm" onClick={() => moveMessage(message.id, 'spam')} className="text-gray-500 hover:text-orange-500">
                                                    <AlertOctagon size={12} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-gray-500">
                                    <Inbox className="mx-auto h-12 w-12 mb-2" />
                                    <p>No messages in {activeCategory}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    {(activeCategory === 'inbox' || activeCategory === 'draft' || activeCategory === 'sent') && (
                        <div className="bg-white p-4 border-t">
                            <div className="flex space-x-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 rounded-full border-gray-300"
                                    style={{ '--tw-ring-color': 'rgba(75, 80, 232, 0.5)', '--tw-border-opacity': '1' } as React.CSSProperties}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button 
                                    onClick={handleSendMessage} 
                                    className="rounded-full p-2"
                                    style={{ background: 'linear-gradient(90deg, rgba(82, 122, 154, 0.9) 0%, rgba(75, 80, 232, 0.8) 100%)' }}
                                    disabled={!newMessage.trim()}
                                >
                                    <Send className="h-4 w-4 text-white" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CategoryButton = ({ category, activeCategory, setActiveCategory, icon }: { category: MessageCategory, activeCategory: MessageCategory, setActiveCategory: (c: MessageCategory) => void, icon: React.ReactNode }) => (
    <Button
        variant={activeCategory === category ? 'default' : 'ghost'}
        size="sm"
        className={`w-full justify-start text-sm ${activeCategory === category ? 'text-white' : 'text-gray-600 hover:bg-gray-200'}`}
        style={activeCategory === category ? { background: 'linear-gradient(90deg, rgba(82, 122, 154, 0.9) 0%, rgba(75, 80, 232, 0.8) 100%)' } : {}}
        onClick={() => setActiveCategory(category)}
    >
        {icon}
        <span className="ml-2 capitalize">{category}</span>
    </Button>
);

function CustomerRetailerChat() {
    const [messages, setMessages] = useState([
        { sender: 'Retailer', text: 'Welcome! How can I help you today?', timestamp: new Date().toISOString() }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const msg = {
            sender: 'Customer',
            text: newMessage,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
        setIsReplying(true);
        // Simulate retailer reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                sender: 'Retailer',
                text: 'Thank you for your message! We will assist you shortly.',
                timestamp: new Date().toISOString(),
            }]);
            setIsReplying(false);
        }, 1200);
    };

    return (
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="text-white px-4 py-3 flex items-center" style={{ background: 'linear-gradient(90deg, rgba(82, 122, 154, 0.8) 0%, rgba(75, 80, 232, 0.7) 100%)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: 'rgba(82, 122, 154, 0.9)' }}>
                    <span className="text-white font-semibold text-sm">CU</span>
                </div>
                <div>
                    <h3 className="font-semibold">Customer & Retailer Chat</h3>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Chat with the retailer for support and orders.</p>
                </div>
            </div>
            <div className="flex flex-col h-96 bg-gray-100 p-4 overflow-y-auto">
                {messages.map((message, idx) => (
                    <div key={idx} className={`flex mb-2 ${message.sender === 'Customer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.sender === 'Customer' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                            <p className="font-medium">{message.sender}</p>
                            <p className="mt-1">{message.text}</p>
                            <p className="text-xs text-gray-200 mt-1">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                ))}
                {isReplying && (
                    <div className="flex justify-start mb-2">
                        <div className="max-w-xs md:max-w-md rounded-lg p-3 bg-gray-200 text-black opacity-70">
                            <p className="font-medium">Retailer</p>
                            <p className="mt-1 italic">Typing...</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-white p-4 border-t flex space-x-2">
                <Input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-full border-gray-300"
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    disabled={isReplying}
                />
                <Button
                    onClick={handleSendMessage}
                    className="rounded-full p-2"
                    style={{ background: 'linear-gradient(90deg, rgba(82, 122, 154, 0.9) 0%, rgba(75, 80, 232, 0.8) 100%)' }}
                    disabled={!newMessage.trim() || isReplying}
                >
                    <Send className="h-4 w-4 text-white" />
                </Button>
            </div>
        </div>
    );
}

export default function Chat() {
    const { dashboard: dashboardProp } = usePage().props as { dashboard?: string };
    const dashboard = dashboardProp || '';

    return (
        <AppLayout>
            <div>
                <Head title="Chat" />
                <div className="container mx-auto px-4 py-8">
                    {getDashboardChat(dashboard)}
                </div>
            </div>
        </AppLayout>
    );
} 