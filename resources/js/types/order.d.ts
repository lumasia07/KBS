// Order-related TypeScript types matching backend models

export type OrderStatus =
    | 'draft'
    | 'submitted'
    | 'pending_verification'
    | 'approved'
    | 'rejected'
    | 'paid'
    | 'processing'
    | 'ready_for_delivery'
    | 'delivered'
    | 'cancelled';

export type DeliveryMethod = 'pickup' | 'delivery';

export type PaymentMethod = 'mobile_money' | 'bank_transfer' | 'cash';

export type PackagingType = 'roll' | 'sheet' | 'individual';

export interface Product {
    id: number;
    code: string;
    name: string;
    description: string | null;
    category: string;
    unit_type: string;
    stamp_price_per_unit: number;
    requires_health_certificate: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface StampType {
    id: number;
    name: string;
    code: string;
    description: string | null;
    price_per_unit: number;
    is_active: boolean;
}

export interface OrderItem {
    product: Product;
    stamp_type?: StampType;
    quantity: number;
    packaging_type: PackagingType;
    unit_price: number;
    subtotal: number;
}

export interface DeliveryDetails {
    method: DeliveryMethod;
    address?: string;
    city?: string;
    province?: string;
    phone?: string;
    notes?: string;
}

export interface OrderDocuments {
    import_declaration?: File | null;
    marketing_authorization?: File | null;
    certificate_of_conformity?: File | null;
    health_certificate?: File | null;
}

export interface StampOrder {
    id: string;
    order_number: string;
    taxpayer_id: number;
    product_id: number;
    stamp_type_id: number | null;
    quantity: number;
    packaging_type: PackagingType;
    unit_price: number;
    total_amount: number;
    tax_amount: number;
    penalty_amount: number;
    grand_total: number;
    status: OrderStatus;
    payment_reference: string | null;
    payment_date: string | null;
    payment_method: PaymentMethod | null;
    payment_provider: string | null;
    delivery_method: DeliveryMethod;
    delivery_address: string | null;
    estimated_delivery_date: string | null;
    actual_delivery_date: string | null;
    delivery_confirmation_code: string | null;
    import_declaration_path: string | null;
    marketing_authorization_path: string | null;
    certificate_of_conformity_path: string | null;
    submitted_by: number | null;
    approved_by: number | null;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
    // Relations
    product?: Product;
    stamp_type?: StampType;
}

export interface OrderFormData {
    items: OrderItem[];
    delivery: DeliveryDetails;
    documents: OrderDocuments;
    payment_method: PaymentMethod | null;
    notes: string;
}

export type OrderStep = 'products' | 'review' | 'delivery' | 'documents' | 'payment' | 'confirmation';
