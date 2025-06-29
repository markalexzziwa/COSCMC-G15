import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageCategory } from './useChatStore';

export interface InventoryMessage extends Omit<Message, 'sender'> {
    sender: 'Manufacturer' | 'Inventory Manager';
}

interface InventoryChatState {
    messages: InventoryMessage[];
    addMessage: (message: Omit<InventoryMessage, 'id' | 'category'>, category?: MessageCategory) => void;
    moveMessage: (messageId: string, newCategory: MessageCategory) => void;
}

const useInventoryChatStore = create<InventoryChatState>((set) => ({
    messages: [
        {
            id: uuidv4(),
            sender: 'Manufacturer',
            text: 'We are running low on raw materials for Shampoo. Please advise.',
            timestamp: new Date().toISOString(),
            category: 'sent',
        },
        {
            id: uuidv4(),
            sender: 'Inventory Manager',
            text: 'Order for raw materials has been placed. ETA is 2 days.',
            timestamp: new Date().toISOString(),
            category: 'inbox',
        }
    ],
    addMessage: (message, category = 'sent') =>
        set((state) => ({
            messages: [...state.messages, { ...message, id: uuidv4(), category } as InventoryMessage],
        })),
    moveMessage: (messageId, newCategory) =>
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg.id === messageId ? { ...msg, category: newCategory } : msg
            ),
        })),
}));

export default useInventoryChatStore; 