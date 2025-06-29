import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type MessageCategory = 'inbox' | 'sent' | 'draft' | 'spam' | 'trash';

export interface Message {
    id: string;
    sender: 'Manufacturer' | 'Factory Store';
    text: string;
    timestamp: string;
    category: MessageCategory;
}

interface ChatState {
    messages: Message[];
    addMessage: (message: Omit<Message, 'id' | 'category'>, category?: MessageCategory) => void;
    moveMessage: (messageId: string, newCategory: MessageCategory) => void;
}

const useChatStore = create<ChatState>((set) => ({
    messages: [
        {
            id: uuidv4(),
            sender: 'Manufacturer',
            text: 'Heads up! We have a new batch of Cooking Oil coming your way.',
            timestamp: new Date().toISOString(),
            category: 'sent',
        },
        {
            id: uuidv4(),
            sender: 'Manufacturer',
            text: 'We are also increasing the production of Shampoo next week.',
            timestamp: new Date().toISOString(),
            category: 'sent',
        },
        {
            id: uuidv4(),
            sender: 'Factory Store',
            text: 'Acknowledged. We are ready to receive the new batch.',
            timestamp: new Date().toISOString(),
            category: 'inbox',
        }
    ],
    addMessage: (message, category = 'sent') =>
        set((state) => ({
            messages: [...state.messages, { ...message, id: uuidv4(), category } as Message],
        })),
    moveMessage: (messageId, newCategory) =>
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg.id === messageId ? { ...msg, category: newCategory } : msg
            ),
        })),
}));

export default useChatStore;
