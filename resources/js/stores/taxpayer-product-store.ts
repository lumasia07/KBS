import { create } from 'zustand';

export interface Product {
    id: number;
    code: string;
    name: string;
    category: string;
    unit_type: string;
    requires_health_certificate: boolean;
    registration_date?: string;
    status?: string;
    health_certificate_number?: string;
    health_certificate_expiry?: string;
    notes?: string;
    certificate_path?: string;
    rejection_reason?: string;
}

interface TaxpayerProductState {
    products: Product[];
    setProducts: (products: Product[]) => void;
    removeProduct: (id: number) => void;
    updateProduct: (id: number, updates: Partial<Product>) => void;
}

export const useTaxpayerProductStore = create<TaxpayerProductState>((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    removeProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
    })),
    updateProduct: (id, updates) => set((state) => ({
        products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
        )
    })),
}));
