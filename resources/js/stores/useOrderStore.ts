import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';
import type {
    Product,
    OrderItem,
    DeliveryDetails,
    OrderDocuments,
    PaymentMethod,
    OrderStep,
    PackagingType,
    StampOrder,
    OrderStatus,
} from '@/types/order';

export interface TableParams {
    page: number;
    pageSize: number;
    search: string;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
}

// Mocks removed

interface OrderState {
    // Products
    products: Product[];
    productsLoading: boolean;
    selectedCategory: string | null;
    searchQuery: string;

    // Cart
    cartItems: OrderItem[];
    cartOpen: boolean;

    // Order form
    currentStep: OrderStep;
    delivery: DeliveryDetails;
    documents: OrderDocuments;
    paymentMethod: PaymentMethod | null;
    orderNotes: string;

    // Order submission
    isSubmitting: boolean;
    submittedOrder: StampOrder | null;

    // Order history
    orderHistory: StampOrder[];
    ordersLoading: boolean;
    tableParams: TableParams;
    totalRecords: number;

    // Actions - Products
    fetchProducts: () => Promise<void>;
    setCategory: (category: string | null) => void;
    setSearchQuery: (query: string) => void;

    // Actions - Cart
    addToCart: (product: Product, quantity: number, packagingType: PackagingType) => void;
    removeFromCart: (productId: number) => void;
    updateCartQuantity: (productId: number, quantity: number) => void;
    updateCartPackaging: (productId: number, packagingType: PackagingType) => void;
    clearCart: () => void;
    toggleCart: () => void;
    setCartOpen: (open: boolean) => void;

    // Actions - Order form
    setStep: (step: OrderStep) => void;
    nextStep: () => void;
    prevStep: () => void;
    setDelivery: (delivery: Partial<DeliveryDetails>) => void;
    setDocuments: (documents: Partial<OrderDocuments>) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    setOrderNotes: (notes: string) => void;

    // Actions - Order submission
    submitOrder: () => Promise<StampOrder | null>;
    resetOrder: () => void;

    // Actions - Order history
    setTableParam: (key: keyof TableParams, value: any) => void;
    fetchOrderHistory: () => Promise<void>;

    // Computed values
    getCartTotal: () => number;
    getCartTax: () => number;
    getCartGrandTotal: () => number;
    getFilteredProducts: () => Product[];
    getCategories: () => string[];
    requiresHealthCertificate: () => boolean;
}

const STEP_ORDER: OrderStep[] = ['products', 'review', 'delivery', 'documents', 'payment', 'confirmation'];
const TAX_RATE = 0.16; // 16% VAT

export const useOrderStore = create<OrderState>()(
    devtools(
        (set, get) => ({
            // Initial state
            products: [],
            productsLoading: false,
            selectedCategory: null,
            searchQuery: '',

            cartItems: [],
            cartOpen: false,

            currentStep: 'products',
            delivery: {
                method: 'pickup',
            },
            documents: {},
            paymentMethod: null,
            orderNotes: '',

            isSubmitting: false,
            submittedOrder: null,

            orderHistory: [],
            ordersLoading: false,
            tableParams: {
                page: 1,
                pageSize: 10,
                search: '',
                sortColumn: 'created_at',
                sortDirection: 'desc',
            },
            totalRecords: 0,

            // Product actions
            fetchProducts: async () => {
                set({ productsLoading: true });
                try {
                    const response = await axios.get('/taxpayer/orders/products');
                    set({ products: response.data, productsLoading: false });
                } catch (error) {
                    console.error('Failed to fetch products', error);
                    set({ products: [], productsLoading: false });
                }
            },

            setCategory: (category) => set({ selectedCategory: category }),
            setSearchQuery: (query) => set({ searchQuery: query }),

            // Cart actions
            addToCart: (product, quantity, packagingType) => {
                const { cartItems } = get();
                const existingItem = cartItems.find((item) => item.product.id === product.id);

                if (existingItem) {
                    set({
                        cartItems: cartItems.map((item) =>
                            item.product.id === product.id
                                ? {
                                    ...item,
                                    quantity: item.quantity + quantity,
                                    subtotal: (item.quantity + quantity) * item.unit_price,
                                }
                                : item
                        ),
                    });
                } else {
                    const newItem: OrderItem = {
                        product,
                        quantity,
                        packaging_type: packagingType,
                        unit_price: product.stamp_price_per_unit,
                        subtotal: quantity * product.stamp_price_per_unit,
                    };
                    set({ cartItems: [...cartItems, newItem] });
                }
            },

            removeFromCart: (productId) => {
                set({
                    cartItems: get().cartItems.filter((item) => item.product.id !== productId),
                });
            },

            updateCartQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                set({
                    cartItems: get().cartItems.map((item) =>
                        item.product.id === productId
                            ? { ...item, quantity, subtotal: quantity * item.unit_price }
                            : item
                    ),
                });
            },

            updateCartPackaging: (productId, packagingType) => {
                set({
                    cartItems: get().cartItems.map((item) =>
                        item.product.id === productId ? { ...item, packaging_type: packagingType } : item
                    ),
                });
            },

            clearCart: () => set({ cartItems: [] }),

            toggleCart: () => set({ cartOpen: !get().cartOpen }),

            setCartOpen: (open) => set({ cartOpen: open }),

            // Order form actions
            setStep: (step) => set({ currentStep: step }),

            nextStep: () => {
                const { currentStep } = get();
                const currentIndex = STEP_ORDER.indexOf(currentStep);
                if (currentIndex < STEP_ORDER.length - 1) {
                    set({ currentStep: STEP_ORDER[currentIndex + 1] });
                }
            },

            prevStep: () => {
                const { currentStep } = get();
                const currentIndex = STEP_ORDER.indexOf(currentStep);
                if (currentIndex > 0) {
                    set({ currentStep: STEP_ORDER[currentIndex - 1] });
                }
            },

            setDelivery: (delivery) =>
                set({
                    delivery: { ...get().delivery, ...delivery },
                }),

            setDocuments: (documents) =>
                set({
                    documents: { ...get().documents, ...documents },
                }),

            setPaymentMethod: (method) => set({ paymentMethod: method }),

            setOrderNotes: (notes) => set({ orderNotes: notes }),

            // Order submission
            submitOrder: async () => {
                const { cartItems, delivery, paymentMethod, orderNotes } = get();

                if (cartItems.length === 0) return null;

                set({ isSubmitting: true });

                try {
                    // Map cart items to backend expectation
                    const items = cartItems.map(item => ({
                        product_id: item.product.id,
                        quantity: item.quantity,
                        packaging_type: item.packaging_type
                    }));

                    const payload = {
                        items,
                        delivery_method: delivery.method,
                        delivery_address: delivery.address,
                        payment_method: paymentMethod,
                        order_notes: orderNotes
                    };

                    const response = await axios.post('/taxpayer/orders', payload);
                    const newOrder = response.data.order; // Assuming backend returns the order

                    set({
                        isSubmitting: false,
                        submittedOrder: newOrder,
                        currentStep: 'confirmation',
                    });

                    // Refresh history
                    get().fetchOrderHistory();

                    return newOrder;

                } catch (error) {
                    console.error('Submit order failed', error);
                    set({ isSubmitting: false });
                    return null;
                }
            },

            resetOrder: () =>
                set({
                    cartItems: [],
                    currentStep: 'products',
                    delivery: { method: 'pickup' },
                    documents: {},
                    paymentMethod: null,
                    orderNotes: '',
                    submittedOrder: null,
                }),

            setTableParam: (key, value) => {
                const { tableParams } = get();
                set({ tableParams: { ...tableParams, [key]: value } });
                get().fetchOrderHistory(); // Refresh on param change
            },

            // Order history
            fetchOrderHistory: async () => {
                const { tableParams } = get();
                set({ ordersLoading: true });

                const params = {
                    draw: Date.now(),
                    start: (tableParams.page - 1) * tableParams.pageSize,
                    length: tableParams.pageSize,
                    search: {
                        value: tableParams.search,
                        regex: false
                    },
                    // Basic column definition to simple sorting might require more match.
                    // For now sending simplified params hoping Yajra accepts them or uses defaults.
                };

                try {
                    const response = await axios.get('/taxpayer/orders/history', { params });
                    // DataTables response: { data: [], recordsTotal: 0, recordsFiltered: 0, ... }
                    set({
                        orderHistory: response.data.data,
                        totalRecords: response.data.recordsTotal,
                        ordersLoading: false
                    });
                } catch (error) {
                    console.error('Failed to fetch order history', error);
                    set({ orderHistory: [], totalRecords: 0, ordersLoading: false });
                }
            },

            // Computed values
            getCartTotal: () => {
                return get().cartItems.reduce((total, item) => total + item.subtotal, 0);
            },

            getCartTax: () => {
                return Math.round(get().getCartTotal() * TAX_RATE);
            },

            getCartGrandTotal: () => {
                return get().getCartTotal() + get().getCartTax();
            },

            getFilteredProducts: () => {
                const { products, selectedCategory, searchQuery } = get();
                return products.filter((product) => {
                    const categoryName = typeof product.category === 'object' && product.category ? (product.category as any).name : String(product.category || 'Uncategorized');
                    const matchesCategory = !selectedCategory || categoryName === selectedCategory;

                    const query = searchQuery.toLowerCase();
                    const matchesSearch =
                        !searchQuery ||
                        product.name.toLowerCase().includes(query) ||
                        product.code.toLowerCase().includes(query);

                    return matchesCategory && matchesSearch && product.is_active;
                });
            },

            getCategories: () => {
                const { products } = get();
                const categories = products.map((p) =>
                    typeof p.category === 'object' && p.category ? (p.category as any).name : String(p.category || 'Uncategorized')
                );
                return [...new Set(categories)].filter(Boolean);
            },

            requiresHealthCertificate: () => {
                return get().cartItems.some((item) => item.product.requires_health_certificate);
            },
        }),
        { name: 'order-store' }
    )
);
