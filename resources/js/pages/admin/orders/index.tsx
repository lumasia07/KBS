import { useState, useEffect, useCallback, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Loader2,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    Eye,
    AlertTriangle,
    DollarSign,
    CreditCard,
    Smartphone,
    Landmark,
    Calendar,
    Banknote,
    RefreshCw,
    Clock
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from 'axios';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

// ============== Types ==============
interface PaymentMethod {
    id: number;
    code: string;
    name: string;
    type: 'mobile_money' | 'card' | 'bank_transfer' | 'cash';
    icon: string | null;
    description: string | null;
    providers: string[] | null;
    settings: {
        requires_phone?: boolean;
        requires_bank_name?: boolean;
        requires_reference?: boolean;
        requires_card_provider?: boolean;
        min_amount?: number;
        max_amount?: number;
        processing_time?: string;
        [key: string]: any;
    };
    is_active: boolean;
    sort_order: number;
}

interface Order {
    id: string;
    order_number: string;
    taxpayer_name: string;
    taxpayer_id: string;
    taxpayer_phone?: string;
    taxpayer_email?: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    tax_amount: number;
    grand_total: number;
    status: string;
    payment_method_id?: number;
    payment_method_code?: string;
    payment_provider?: string;
    payment_reference?: string;
    delivery_method: string;
    delivery_address: string;
    created_at: string;
    updated_at: string;
    packaging_type: string;
    rejection_reason?: string;
    payment_date?: string;
}

interface TableParams {
    page: number;
    pageSize: number;
    search: string;
}

interface PaymentFormData {
    payment_method_id: number | null;
    payment_reference: string;
    payment_date: string;
    phone_number: string;
    bank_name: string;
    card_provider: string;
}

interface Props {
    paymentMethods: PaymentMethod[];
}

// ============== Constants & Helpers ==============
const STATUS_COLORS: Record<string, string> = {
    'delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'approved': 'bg-blue-100 text-blue-800 border-blue-200',
    'in_production': 'bg-blue-100 text-blue-800 border-blue-200',
    'ready_for_delivery': 'bg-blue-100 text-blue-800 border-blue-200',
    'submitted': 'bg-amber-100 text-amber-800 border-amber-200',
    'pending': 'bg-amber-100 text-amber-800 border-amber-200',
    'payment_pending': 'bg-amber-100 text-amber-800 border-amber-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200',
    'rejected': 'bg-red-100 text-red-800 border-red-200',
    'paid': 'bg-purple-100 text-purple-800 border-purple-200',
};

const ICON_MAP = {
    smartphone: Smartphone,
    'credit-card': CreditCard,
    landmark: Landmark,
    banknote: Banknote,
} as const;

const PHONE_REGEX = /^(\+243|0)[0-9]{9}$/;

const getIconComponent = (iconName: string | null) => {
    if (!iconName) return CreditCard;
    return ICON_MAP[iconName as keyof typeof ICON_MAP] || CreditCard;
};

// ============== Main Component ==============
export default function AdminOrderIndex({ paymentMethods = [] }: Props) {
    // ============== State ==============
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [params, setParams] = useState<TableParams>({
        page: 1,
        pageSize: 10,
        search: ''
    });
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Modal States
    const [modals, setModals] = useState({
        details: false,
        approve: false,
        reject: false,
        payment: false
    });

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Payment Form
    const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
        payment_method_id: null,
        payment_reference: '',
        payment_date: new Date().toISOString().split('T')[0],
        phone_number: '',
        bank_name: '',
        card_provider: '',
    });

    // ============== Memoized Values ==============
    const activePaymentMethods = useMemo(() =>
        paymentMethods.filter(m => m.is_active).sort((a, b) => a.sort_order - b.sort_order),
        [paymentMethods]
    );

    const selectedPaymentMethod = useMemo(() =>
        paymentMethods.find(m => m.id === paymentForm.payment_method_id),
        [paymentMethods, paymentForm.payment_method_id]
    );

    const totalPages = useMemo(() =>
        Math.ceil(totalRecords / params.pageSize),
        [totalRecords, params.pageSize]
    );

    const stats = useMemo(() => ({
        pendingPayment: orders.filter(o => o.status === 'payment_pending').length,
        pendingApproval: orders.filter(o => o.status === 'pending' || o.status === 'submitted').length,
        paid: orders.filter(o => o.status === 'paid').length,
        total: totalRecords
    }), [orders, totalRecords]);

    // ============== API Functions ==============
    const fetchOrders = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const query = {
                draw: Date.now(),
                start: (params.page - 1) * params.pageSize,
                length: params.pageSize,
                search: { value: params.search, regex: false }
            };

            const response = await axios.get('/admin/orders', {
                params: query,
                headers: { 'Accept': 'application/json' }
            });

            setOrders(response.data.data);
            setTotalRecords(response.data.recordsTotal);
        } catch (error) {
            console.error('Failed to fetch orders', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [params.page, params.pageSize, params.search]);

    // ============== Effects ==============
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchOrders();
        }, 300);
        return () => clearTimeout(timeout);
    }, [params.page, params.search, fetchOrders]);

    // ============== Handlers ==============
    const handleSearch = (value: string) => {
        setParams(p => ({ ...p, search: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setParams(p => ({ ...p, page: newPage }));
    };

    const handleRefresh = () => {
        fetchOrders(true);
    };

    const openModal = (modal: keyof typeof modals, order: Order | null = null) => {
        if (order) {
            setSelectedOrder(order);
        }
        setModals(prev => ({ ...prev, [modal]: true }));
    };

    const closeModal = (modal: keyof typeof modals) => {
        setModals(prev => ({ ...prev, [modal]: false }));
        if (modal === 'payment') {
            resetPaymentForm();
        }
        if (modal === 'reject') {
            setRejectionReason('');
        }
    };

    const resetPaymentForm = () => {
        setPaymentForm({
            payment_method_id: null,
            payment_reference: '',
            payment_date: new Date().toISOString().split('T')[0],
            phone_number: '',
            bank_name: '',
            card_provider: '',
        });
    };

    const updatePaymentForm = (field: keyof PaymentFormData, value: any) => {
        setPaymentForm(prev => ({ ...prev, [field]: value }));
    };

    // ============== Action Handlers ==============
    const handleApprove = async () => {
        if (!selectedOrder) return;

        setProcessingId(selectedOrder.id);
        try {
            await axios.post(`/admin/orders/${selectedOrder.id}/approve`);
            toast.success('Order approved successfully');
            await fetchOrders();
            closeModal('approve');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve order');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (!selectedOrder) return;
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        setProcessingId(selectedOrder.id);
        try {
            await axios.post(`/admin/orders/${selectedOrder.id}/reject`, { reason: rejectionReason });
            toast.success('Order rejected successfully');
            await fetchOrders();
            closeModal('reject');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject order');
        } finally {
            setProcessingId(null);
        }
    };

    const validatePayment = (): boolean => {
        if (!selectedPaymentMethod) {
            toast.error('Please select a payment method');
            return false;
        }

        const settings = selectedPaymentMethod.settings || {};

        // Amount validation
        if (selectedOrder && settings.min_amount && selectedOrder.grand_total < settings.min_amount) {
            toast.error(`Minimum amount allowed is ${formatCurrency(settings.min_amount)}`);
            return false;
        }
        if (selectedOrder && settings.max_amount && selectedOrder.grand_total > settings.max_amount) {
            toast.error(`Maximum amount allowed is ${formatCurrency(settings.max_amount)}`);
            return false;
        }

        // Type-specific validation
        switch (selectedPaymentMethod.type) {
            case 'mobile_money':
                if (settings.requires_phone && !paymentForm.phone_number) {
                    toast.error('Please enter the phone number used for payment');
                    return false;
                }
                if (paymentForm.phone_number && !PHONE_REGEX.test(paymentForm.phone_number)) {
                    toast.error('Please enter a valid phone number (e.g., +243XXXXXXXXX or 0XXXXXXXXX)');
                    return false;
                }
                break;

            case 'bank_transfer':
                if (settings.requires_bank_name && !paymentForm.bank_name) {
                    toast.error('Please enter the bank name');
                    return false;
                }
                break;

            case 'card':
                if (settings.requires_card_provider && !paymentForm.card_provider) {
                    toast.error('Please select the card provider');
                    return false;
                }
                break;
        }

        // Reference validation
        if (settings.requires_reference && !paymentForm.payment_reference && selectedPaymentMethod.type !== 'cash') {
            toast.error('Please enter a payment reference/transaction ID');
            return false;
        }

        return true;
    };

    const handlePayment = async () => {
        if (!selectedOrder || !selectedPaymentMethod) return;

        if (!validatePayment()) {
            return;
        }

        setProcessingId(selectedOrder.id);
        try {
            const paymentData = {
                order_id: selectedOrder.id,
                payment_method_id: selectedPaymentMethod.id,
                payment_reference: paymentForm.payment_reference || null,
                payment_date: paymentForm.payment_date,
                ...(selectedPaymentMethod.type === 'mobile_money' && { phone_number: paymentForm.phone_number }),
                ...(selectedPaymentMethod.type === 'bank_transfer' && { bank_name: paymentForm.bank_name }),
                ...(selectedPaymentMethod.type === 'card' && { card_provider: paymentForm.card_provider }),
            };

            const response = await axios.post('/taxpayer/payments/store', paymentData);

            if (response.data.success) {
                toast.success('Payment recorded successfully');
                await fetchOrders();
                closeModal('payment');
            } else {
                toast.error(response.data.message || 'Failed to record payment');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to record payment');
        } finally {
            setProcessingId(null);
        }
    };

    // ============== Render Helpers ==============
    const renderStatusBadge = (status: string) => (
        <Badge variant="outline" className={`${STATUS_COLORS[status] || 'bg-slate-100 text-slate-800 border-slate-200'} font-medium`}>
            {status.toUpperCase().replace('_', ' ')}
        </Badge>
    );

    const renderPaymentMethod = (methodCode?: string, reference?: string) => {
        if (!methodCode) return <span className="text-xs text-slate-400">Not specified</span>;

        const method = paymentMethods.find(m => m.code === methodCode);
        const IconComponent = method ? getIconComponent(method.icon) : CreditCard;

        return (
            <div>
                <div className="flex items-center text-xs text-slate-600">
                    <IconComponent className="h-3 w-3 mr-1" />
                    <span className="capitalize">{method?.name || methodCode}</span>
                </div>
                {reference && (
                    <div className="text-xs text-slate-500 mt-1">
                        Ref: {reference}
                    </div>
                )}
            </div>
        );
    };

    const renderPaymentFields = () => {
        if (!selectedPaymentMethod) return null;

        const settings = selectedPaymentMethod.settings || {};

        return (
            <>
                {selectedPaymentMethod.type === 'mobile_money' && settings.requires_phone && (
                    <div>
                        <Label htmlFor="phoneNumber">Phone Number Used</Label>
                        <Input
                            id="phoneNumber"
                            placeholder="+243 XXX XXX XXX"
                            value={paymentForm.phone_number}
                            onChange={(e) => updatePaymentForm('phone_number', e.target.value)}
                            className="mt-1"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Format: +243XXXXXXXXX or 0XXXXXXXXX
                        </p>
                    </div>
                )}

                {selectedPaymentMethod.type === 'bank_transfer' && settings.requires_bank_name && (
                    <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                            id="bankName"
                            placeholder="e.g., Equity Bank, Rawbank..."
                            value={paymentForm.bank_name}
                            onChange={(e) => updatePaymentForm('bank_name', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                )}

                {selectedPaymentMethod.type === 'card' && settings.requires_card_provider && (
                    <div>
                        <Label htmlFor="cardProvider">Card Provider</Label>
                        <Select
                            value={paymentForm.card_provider}
                            onValueChange={(value) => updatePaymentForm('card_provider', value)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="visa">Visa</SelectItem>
                                <SelectItem value="mastercard">Mastercard</SelectItem>
                                <SelectItem value="amex">American Express</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {settings.requires_reference && selectedPaymentMethod.type !== 'cash' && (
                    <div>
                        <Label htmlFor="paymentReference">Transaction Reference</Label>
                        <Input
                            id="paymentReference"
                            placeholder="Enter transaction ID or reference"
                            value={paymentForm.payment_reference}
                            onChange={(e) => updatePaymentForm('payment_reference', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                )}
            </>
        );
    };

    // ============== Render ==============
    return (
        <AppLayout breadcrumbs={[{ title: 'Order Management', href: '/admin/orders' }]}>
            <Head title="Manage Orders" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Order Management
                    </h1>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard
                        title="Pending Payment"
                        value={stats.pendingPayment}
                        color="amber"
                        icon={DollarSign}
                    />
                    <StatCard
                        title="Pending Approval"
                        value={stats.pendingApproval}
                        color="blue"
                        icon={Clock}
                    />
                    <StatCard
                        title="Paid"
                        value={stats.paid}
                        color="purple"
                        icon={CheckCircle}
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats.total}
                        color="emerald"
                        icon={Calendar}
                    />
                </div>

                {/* Search Bar */}
                <SearchBar
                    value={params.search}
                    onChange={handleSearch}
                    placeholder="Search by order #, taxpayer name, or reference..."
                />

                {/* Orders Table */}
                <OrdersTable
                    orders={orders}
                    loading={loading}
                    processingId={processingId}
                    onViewDetails={(order) => openModal('details', order)}
                    onApprove={(order) => openModal('approve', order)}
                    onReject={(order) => openModal('reject', order)}
                    onReceivePayment={(order) => openModal('payment', order)}
                    renderStatusBadge={renderStatusBadge}
                    renderPaymentMethod={renderPaymentMethod}
                />

                {/* Pagination */}
                {totalRecords > 0 && (
                    <Pagination
                        currentPage={params.page}
                        totalPages={totalPages}
                        pageSize={params.pageSize}
                        totalRecords={totalRecords}
                        onPageChange={handlePageChange}
                        loading={loading}
                    />
                )}
            </div>

            {/* Modals */}
            <DetailsModal
                open={modals.details}
                onClose={() => closeModal('details')}
                order={selectedOrder}
                renderStatusBadge={renderStatusBadge}
                renderPaymentMethod={renderPaymentMethod}
                fetchOrders={fetchOrders}
            />

            <ApproveModal
                open={modals.approve}
                onClose={() => closeModal('approve')}
                order={selectedOrder}
                onConfirm={handleApprove}
                processing={!!processingId}
            />

            <RejectModal
                open={modals.reject}
                onClose={() => closeModal('reject')}
                order={selectedOrder}
                reason={rejectionReason}
                onReasonChange={setRejectionReason}
                onConfirm={handleReject}
                processing={!!processingId}
            />

            <PaymentModal
                open={modals.payment}
                onClose={() => closeModal('payment')}
                order={selectedOrder}
                paymentMethods={activePaymentMethods}
                selectedMethod={selectedPaymentMethod}
                paymentForm={paymentForm}
                onMethodChange={(id) => updatePaymentForm('payment_method_id', id)}
                onFormChange={updatePaymentForm}
                onConfirm={handlePayment}
                processing={!!processingId}
                renderPaymentFields={renderPaymentFields}
            />
        </AppLayout>
    );
}

// ============== Sub-components ==============

// Stat Card Component
const StatCard = ({ title, value, color, icon: Icon }: any) => (
    <Card className={`bg-gradient-to-br from-${color}-500 to-${color}-600 text-white`}>
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

// Search Bar Component
const SearchBar = ({ value, onChange, placeholder }: any) => (
    <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="font-medium text-slate-900">All Stamp Orders</div>
        <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
                placeholder={placeholder}
                className="pl-9 bg-slate-50 border-slate-200 focus:border-blue-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);

// Orders Table Component
const OrdersTable = ({
    orders,
    loading,
    processingId,
    onViewDetails,
    onApprove,
    onReject,
    onReceivePayment,
    renderStatusBadge,
    renderPaymentMethod
}: any) => (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
            <TableHeader className="bg-slate-50">
                <TableRow>
                    <TableHead className="font-semibold text-slate-600">Order #</TableHead>
                    <TableHead className="font-semibold text-slate-600">Taxpayer</TableHead>
                    <TableHead className="font-semibold text-slate-600">Product</TableHead>
                    <TableHead className="font-semibold text-slate-600">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                    <TableHead className="font-semibold text-slate-600">Payment</TableHead>
                    <TableHead className="font-semibold text-slate-600">Date</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                        </TableCell>
                    </TableRow>
                ) : orders.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                            No orders found.
                        </TableCell>
                    </TableRow>
                ) : (
                    orders.map((order: Order) => (
                        <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="font-medium text-slate-700">{order.order_number}</TableCell>
                            <TableCell>
                                <div className="text-slate-900">{order.taxpayer_name}</div>
                                {order.taxpayer_phone && (
                                    <div className="text-xs text-slate-500">{order.taxpayer_phone}</div>
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600">{order.product_name}</TableCell>
                            <TableCell>
                                <div className="font-medium text-slate-900">{formatCurrency(order.grand_total)}</div>
                                <div className="text-xs text-slate-500">{order.quantity.toLocaleString()} units</div>
                            </TableCell>
                            <TableCell>{renderStatusBadge(order.status)}</TableCell>
                            <TableCell>{renderPaymentMethod(order.payment_method_code, order.payment_reference)}</TableCell>
                            <TableCell className="text-slate-500 text-sm">
                                {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {order.status === 'payment_pending' && (
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() => onReceivePayment(order)}
                                            disabled={processingId === order.id}
                                        >
                                            <DollarSign className="h-4 w-4 mr-1" />
                                            Receive
                                        </Button>
                                    )}

                                    {(order.status === 'submitted' || order.status === 'pending') && (
                                        <>
                                            <ActionButton
                                                icon={CheckCircle}
                                                onClick={() => onApprove(order)}
                                                disabled={processingId === order.id}
                                                color="emerald"
                                                title="Approve Order"
                                            />
                                            <ActionButton
                                                icon={XCircle}
                                                onClick={() => onReject(order)}
                                                disabled={processingId === order.id}
                                                color="red"
                                                title="Reject Order"
                                            />
                                        </>
                                    )}

                                    <ActionButton
                                        icon={Eye}
                                        onClick={() => onViewDetails(order)}
                                        disabled={processingId === order.id}
                                        color="blue"
                                        title="View Details"
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </div>
);

// Action Button Component
const ActionButton = ({ icon: Icon, onClick, disabled, color, title }: any) => (
    <Button
        size="icon"
        variant="ghost"
        className={`h-8 w-8 text-${color}-600 hover:text-${color}-700 hover:bg-${color}-50 rounded-full`}
        onClick={onClick}
        disabled={disabled}
        title={title}
    >
        <Icon className="h-4 w-4" />
    </Button>
);

// Pagination Component
const Pagination = ({
    currentPage,
    totalPages,
    pageSize,
    totalRecords,
    onPageChange,
    loading
}: any) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
        <div className="text-sm text-slate-500">
            Showing {Math.min(((currentPage - 1) * pageSize) + 1, totalRecords)} to{' '}
            {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} entries
        </div>
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    </div>
);

// Details Modal - FIXED: Added fetchOrders prop
const DetailsModal = ({
    open,
    onClose,
    order,
    renderStatusBadge,
    renderPaymentMethod,
    fetchOrders
}: any) => {
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    // Available status options
    const statusOptions = [
        { value: 'in_production', label: 'In Production', color: 'blue' },
        { value: 'ready_for_delivery', label: 'Ready for Delivery', color: 'blue' },
        { value: 'delivered', label: 'Delivered', color: 'emerald' },
        { value: 'cancelled', label: 'Cancelled', color: 'red' },
        { value: 'rejected', label: 'Rejected', color: 'red' },
    ];

    // Set selected status when order changes
    useEffect(() => {
        if (order?.status) {
            setSelectedStatus(order.status);
        }
    }, [order]);

    const handleStatusChange = async (newStatus: string) => {
        if (!order || newStatus === order.status) return;

        setUpdatingStatus(true);
        try {
            const response = await axios.post(`/admin/orders/${order.id}/status`, { status: newStatus });

            if (response.data.success) {
                toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`);
                await fetchOrders();
                onClose();
            } else {
                toast.error(response.data.message || 'Failed to update status');
            }

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Review complete information for Order #{order?.order_number}
                    </DialogDescription>
                </DialogHeader>
                {order && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailField label="Taxpayer" value={order.taxpayer_name} />
                            <div>
                                <Label className="text-slate-500">Status</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    {renderStatusBadge(order.status)}

                                    {/* Status Change Dropdown */}
                                    <Select
                                        value={selectedStatus}
                                        onValueChange={handleStatusChange}
                                        disabled={updatingStatus}
                                    >
                                        <SelectTrigger className="w-[180px] h-8">
                                            <SelectValue placeholder="Change status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                    disabled={option.value === order.status}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={`${STATUS_COLORS[option.value]} px-2 py-0 text-xs`}
                                                        >
                                                            {option.label}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {updatingStatus && (
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                    )}
                                </div>
                            </div>

                            <DetailField label="Product" value={order.product_name} />
                            <DetailField label="Packaging" value={order.packaging_type} />
                            <DetailField label="Quantity" value={order.quantity.toLocaleString()} />
                            <DetailField
                                label="Grand Total"
                                value={<span className="font-bold text-lg">{formatCurrency(order.grand_total)}</span>}
                            />

                            <div className="col-span-2">
                                <DetailField
                                    label="Delivery Address"
                                    value={order.delivery_method === 'pickup' ? 'Store Pickup' : order.delivery_address}
                                />
                            </div>

                            <DetailField
                                label="Payment Method"
                                value={renderPaymentMethod(order.payment_method_code)}
                            />

                            {order.payment_reference && (
                                <DetailField
                                    label="Payment Ref"
                                    value={<span className="font-mono text-sm">{order.payment_reference}</span>}
                                />
                            )}

                            <DetailField
                                label="Date Placed"
                                value={new Date(order.created_at).toLocaleString()}
                            />

                            {order.payment_date && (
                                <DetailField
                                    label="Payment Date"
                                    value={new Date(order.payment_date).toLocaleDateString()}
                                />
                            )}

                            {order.rejection_reason && (
                                <div className="col-span-2 bg-red-50 p-3 rounded-md border border-red-100">
                                    <Label className="text-red-600 font-semibold mb-1 block">Rejection Reason</Label>
                                    <div className="text-red-700 text-sm">{order.rejection_reason}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Approve Modal
const ApproveModal = ({ open, onClose, order, onConfirm, processing }: any) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Approve Order</DialogTitle>
                <DialogDescription>
                    Are you sure you want to approve Order <b>{order?.order_number}</b>?
                    This will move the order to Processing status.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={onConfirm}
                    disabled={processing}
                >
                    {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Confirm Approval
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

// Reject Modal
const RejectModal = ({ open, onClose, order, reason, onReasonChange, onConfirm, processing }: any) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Reject Order
                </DialogTitle>
                <DialogDescription>
                    You are about to reject Order <b>{order?.order_number}</b>.
                    Please provide a reason for the taxpayer.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="reason" className="mb-2 block">Rejection Reason</Label>
                <textarea
                    id="reason"
                    className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                    placeholder="e.g., Invalid Import Declaration document..."
                    value={reason}
                    onChange={(e) => onReasonChange(e.target.value)}
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button
                    variant="destructive"
                    onClick={onConfirm}
                    disabled={processing}
                >
                    {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                    Reject Order
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

// Payment Modal
const PaymentModal = ({
    open,
    onClose,
    order,
    paymentMethods,
    selectedMethod,
    paymentForm,
    onMethodChange,
    onFormChange,
    onConfirm,
    processing,
    renderPaymentFields
}: any) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Record Payment
                </DialogTitle>
                <DialogDescription>
                    Record payment received for Order #{order?.order_number}
                </DialogDescription>
            </DialogHeader>

            {order && (
                <div className="py-4 space-y-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Amount Due:</span>
                            <span className="text-lg font-bold text-emerald-600">
                                {formatCurrency(order.grand_total)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-slate-600">Taxpayer:</span>
                            <span className="text-sm font-medium">{order.taxpayer_name}</span>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select
                            value={paymentForm.payment_method_id?.toString() || ''}
                            onValueChange={(value) => onMethodChange(parseInt(value))}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentMethods.map((method: PaymentMethod) => {
                                    const IconComponent = getIconComponent(method.icon);
                                    return (
                                        <SelectItem key={method.id} value={method.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <IconComponent className="h-4 w-4" />
                                                {method.name}
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {renderPaymentFields()}

                    <div>
                        <Label htmlFor="paymentDate">Payment Date</Label>
                        <Input
                            id="paymentDate"
                            type="date"
                            value={paymentForm.payment_date}
                            onChange={(e) => onFormChange('payment_date', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                </div>
            )}

            <DialogFooter className="gap-2">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={onConfirm}
                    disabled={processing || !selectedMethod}
                >
                    {processing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Record Payment
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

// Detail Field Component
const DetailField = ({ label, value }: any) => (
    <div>
        <Label className="text-slate-500">{label}</Label>
        <div className="font-medium text-slate-900">{value}</div>
    </div>
);