import { create } from 'zustand';

interface StockItem {
    name: string;
    quantity: number;
    image: string;
    unit: string;
    packageSize: number;
    packageUnit: string;
    boxSize: number;
}

interface StockState {
    stock: StockItem[];
    addStock: (productName: string, quantity: number) => void;
    updateStock: (productName: string, quantity: number) => void;
}

const useStockStore = create<StockState>((set) => ({
    stock: [
        { name: 'Cooking Oil', quantity: 700000, image: '/cooking oil.jpg', unit: 'ml', packageSize: 500, packageUnit: 'jerrycan', boxSize: 4 },
        { name: 'Shampoo', quantity: 600000, image: '/shampoo.jpg', unit: 'ml', packageSize: 200, packageUnit: 'tube', boxSize: 12 },
        { name: 'Margarine', quantity: 640000, image: '/soft magarine.jpg', unit: 'g', packageSize: 400, packageUnit: 'container', boxSize: 8 },
    ],
    addStock: (productName, quantity) =>
        set((state) => ({
            stock: state.stock.map((item) =>
                item.name === productName ? { ...item, quantity: item.quantity + quantity } : item
            ),
        })),
    updateStock: (productName, quantity) =>
        set((state) => ({
            stock: state.stock.map((item) =>
                item.name === productName ? { ...item, quantity } : item
            ),
        })),
}));

export default useStockStore; 