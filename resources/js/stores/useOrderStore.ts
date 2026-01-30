import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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

// Mock products data - will be replaced with API fetch
const mockProducts: Product[] = [
    {
        id: 1,
        code: 'BEER-001',
        name: 'Beer (Local)',
        description: 'Locally brewed beer products',
        category: 'Beverages',
        unit_type: 'bottle',
        stamp_price_per_unit: 150,
        requires_health_certificate: true,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        code: 'BEER-002',
        name: 'Beer (Imported)',
        description: 'Imported beer products',
        category: 'Beverages',
        unit_type: 'bottle',
        stamp_price_per_unit: 250,
        requires_health_certificate: true,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 3,
        code: 'SPIRITS-001',
        name: 'Spirits (Local)',
        description: 'Locally produced spirits and liquor',
        category: 'Beverages',
        unit_type: 'bottle',
        stamp_price_per_unit: 300,
        requires_health_certificate: true,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 4,
        code: 'SPIRITS-002',
        name: 'Spirits (Imported)',
        description: 'Imported spirits and liquor',
        category: 'Beverages',
        unit_type: 'bottle',
        stamp_price_per_unit: 500,
        requires_health_certificate: true,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 5,
        code: 'WINE-001',
        name: 'Wine',
        description: 'All wine products',
        category: 'Beverages',
        unit_type: 'bottle',
        stamp_price_per_unit: 200,
        requires_health_certificate: false,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 6,
        code: 'TOBACCO-001',
        name: 'Cigarettes',
        description: 'Cigarette products',
        category: 'Tobacco',
        unit_type: 'pack',
        stamp_price_per_unit: 100,
        requires_health_certificate: false,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 7,
        code: 'TOBACCO-002',
        name: 'Cigars',
        description: 'Cigar products',
        category: 'Tobacco',
        unit_type: 'piece',
        stamp_price_per_unit: 350,
        requires_health_certificate: false,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 8,
        code: 'PHARMA-001',
        name: 'Pharmaceuticals',
        description: 'Pharmaceutical products requiring stamps',
        category: 'Pharmaceuticals',
        unit_type: 'unit',
        stamp_price_per_unit: 75,
        requires_health_certificate: true,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
];

// Mock order history
const mockOrderHistory: StampOrder[] = [
    {
        id: 'ord-001',
        order_number: 'KBS-2024-00156',
        taxpayer_id: 1,
        product_id: 1,
        stamp_type_id: 1,
        quantity: 1000,
        packaging_type: 'roll',
        unit_price: 150,
        total_amount: 150000,
        tax_amount: 24000,
        penalty_amount: 0,
        grand_total: 174000,
        status: 'delivered',
        payment_reference: 'PAY-2024-001',
        payment_date: '2024-01-15T10:30:00Z',
        payment_method: 'mobile_money',
        payment_provider: 'M-Pesa',
        delivery_method: 'pickup',
        delivery_address: null,
        estimated_delivery_date: '2024-01-17T00:00:00Z',
        actual_delivery_date: '2024-01-17T14:00:00Z',
        delivery_confirmation_code: 'CONF-001',
        import_declaration_path: null,
        marketing_authorization_path: null,
        certificate_of_conformity_path: null,
        submitted_by: 1,
        approved_by: 2,
        rejection_reason: null,
        created_at: '2024-01-14T08:00:00Z',
        updated_at: '2024-01-17T14:00:00Z',
    },
    {
        id: 'ord-002',
        order_number: 'KBS-2024-00189',
        taxpayer_id: 1,
        product_id: 3,
        stamp_type_id: 1,
        quantity: 500,
        packaging_type: 'sheet',
        unit_price: 300,
        total_amount: 150000,
        tax_amount: 24000,
        penalty_amount: 0,
        grand_total: 174000,
        status: 'processing',
        payment_reference: 'PAY-2024-002',
        payment_date: '2024-01-20T09:00:00Z',
        payment_method: 'bank_transfer',
        payment_provider: 'Rawbank',
        delivery_method: 'delivery',
        delivery_address: '123 Avenue Lumumba, Kinshasa',
        estimated_delivery_date: '2024-01-25T00:00:00Z',
        actual_delivery_date: null,
        delivery_confirmation_code: null,
        import_declaration_path: null,
        marketing_authorization_path: null,
        certificate_of_conformity_path: null,
        submitted_by: 1,
        approved_by: 2,
        rejection_reason: null,
        created_at: '2024-01-19T11:00:00Z',
        updated_at: '2024-01-20T09:00:00Z',
    },
    {
        id: 'ord-003',
        order_number: 'KBS-2024-00201',
        taxpayer_id: 1,
        product_id: 6,
        stamp_type_id: 2,
        quantity: 2000,
        packaging_type: 'roll',
        unit_price: 100,
        total_amount: 200000,
        tax_amount: 32000,
        penalty_amount: 0,
        grand_total: 232000,
        status: 'pending_verification',
        payment_reference: null,
        payment_date: null,
        payment_method: null,
        payment_provider: null,
        delivery_method: 'pickup',
        delivery_address: null,
        estimated_delivery_date: null,
        actual_delivery_date: null,
        delivery_confirmation_code: null,
        import_declaration_path: null,
        marketing_authorization_path: null,
        certificate_of_conformity_path: null,
        submitted_by: 1,
        approved_by: null,
        rejection_reason: null,
        created_at: '2024-01-22T14:30:00Z',
        updated_at: '2024-01-22T14:30:00Z',
    },
];

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

            // Product actions
            fetchProducts: async () => {
                set({ productsLoading: true });
                // Simulate API call - replace with actual API when backend is ready
                await new Promise((resolve) => setTimeout(resolve, 500));
                set({ products: mockProducts, productsLoading: false });
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
                const { cartItems, delivery, paymentMethod, getCartTotal, getCartTax, getCartGrandTotal } = get();

                if (cartItems.length === 0) return null;

                set({ isSubmitting: true });

                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1500));

                const orderNumber = `KBS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

                const newOrder: StampOrder = {
                    id: `ord-${Date.now()}`,
                    order_number: orderNumber,
                    taxpayer_id: 1, // Will come from auth
                    product_id: cartItems[0].product.id,
                    stamp_type_id: null,
                    quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
                    packaging_type: cartItems[0].packaging_type,
                    unit_price: cartItems[0].unit_price,
                    total_amount: getCartTotal(),
                    tax_amount: getCartTax(),
                    penalty_amount: 0,
                    grand_total: getCartGrandTotal(),
                    status: 'submitted' as OrderStatus,
                    payment_reference: null,
                    payment_date: null,
                    payment_method: paymentMethod,
                    payment_provider: null,
                    delivery_method: delivery.method,
                    delivery_address: delivery.address || null,
                    estimated_delivery_date: null,
                    actual_delivery_date: null,
                    delivery_confirmation_code: null,
                    import_declaration_path: null,
                    marketing_authorization_path: null,
                    certificate_of_conformity_path: null,
                    submitted_by: 1,
                    approved_by: null,
                    rejection_reason: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                set({
                    isSubmitting: false,
                    submittedOrder: newOrder,
                    currentStep: 'confirmation',
                    orderHistory: [newOrder, ...get().orderHistory],
                });

                return newOrder;
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

            // Order history
            fetchOrderHistory: async () => {
                set({ ordersLoading: true });
                await new Promise((resolve) => setTimeout(resolve, 500));
                set({ orderHistory: mockOrderHistory, ordersLoading: false });
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
                    const matchesCategory = !selectedCategory || product.category === selectedCategory;
                    const matchesSearch =
                        !searchQuery ||
                        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.code.toLowerCase().includes(searchQuery.toLowerCase());
                    return matchesCategory && matchesSearch && product.is_active;
                });
            },

            getCategories: () => {
                const { products } = get();
                return [...new Set(products.map((p) => p.category))];
            },

            requiresHealthCertificate: () => {
                return get().cartItems.some((item) => item.product.requires_health_certificate);
            },
        }),
        { name: 'order-store' }
    )
);
