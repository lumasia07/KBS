import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    CreditCard,
    Plus,
    Eye,
    Download,
    Search,
    Filter,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    FileText,
    Calendar,
    Landmark,
    Smartphone,
    X
} from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useSwal } from '@/Hooks/useSwal';

// Types aligned with backend
interface Order {
    id: string;
    order_number: string;
    product?: {
        name: string;
    };
    stamp_type?: {
        name: string;
    };
    quantity?: number;
}

interface PaymentMethod {
    id: string;
    name: string;
    code: string;
    type: 'mobile_money' | 'card' | 'bank_transfer';
    logo?: string;
}

interface Payment {
    id: string;
    invoice_number: string;  // Changed from payment_reference
    transaction_id: string | null;
    amount: number;
    tax_amount: number;
    penalty_amount: number;
    total_amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_date: string | null;
    confirmation_date: string | null;
    failure_reason: string | null;
    created_at: string;
    updated_at: string;
    
    // Relationships
    order?: Order;
    paymentMethod?: PaymentMethod;
    
    // Payment provider response data (parsed from JSON)
    payment_provider_response?: {
        phone_number?: string;
        bank_name?: string;
        bank_account_number?: string;
        card_provider?: string;
        reference?: string;
        ip_address?: string;
        user_agent?: string;
        submitted_at?: string;
        payment_method?: string;
    } | null;
    
    // For backward compatibility
    payment_method?: string;
    payment_provider?: string | null;
}

interface Filters {
    search?: string;
    status?: string;
    payment_method_id?: string;
    date_from?: string;
    date_to?: string;
}

interface Props {
    payments: {
        data: Payment[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    paymentMethods: PaymentMethod[];
    filters: Filters;
}

export default function TaxpayerPaymentsIndex({ payments, paymentMethods, filters }: Props) {
    const swal = useSwal();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Local filter states
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [methodFilter, setMethodFilter] = useState(filters?.payment_method_id || 'all');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== filters?.search) {
                applyFilters();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/taxpayer/dashboard',
        },
        {
            title: 'Payments',
            href: '/taxpayer/payments',
        },
    ];

    // Stats calculations
    const stats = useMemo(() => {
        const allPayments = payments?.data || [];
        return {
            total: allPayments.length,
            completed: allPayments.filter(p => p.status === 'completed').length,
            pending: allPayments.filter(p => p.status === 'pending').length,
            totalAmount: allPayments.reduce((sum, p) => sum + (p.total_amount || p.amount), 0)
        };
    }, [payments]);

    const applyFilters = useCallback(() => {
        router.get('/taxpayer/payments', {
            search: searchTerm || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            payment_method_id: methodFilter !== 'all' ? methodFilter : undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [searchTerm, statusFilter, methodFilter, dateFrom, dateTo]);

    const refreshData = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['payments'],
            onSuccess: () => {
                setIsRefreshing(false);
                toast.success('Payments refreshed');
            },
            onError: () => {
                setIsRefreshing(false);
                toast.error('Failed to refresh data');
            }
        });
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setMethodFilter('all');
        setDateFrom('');
        setDateTo('');
        
        router.get('/taxpayer/payments', {}, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.info('Filters cleared');
                setShowFilterModal(false);
            }
        });
    };

    const handleFilterApply = () => {
        applyFilters();
        setShowFilterModal(false);
    };

    const viewPaymentDetails = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowDetailsModal(true);
    };

    const downloadReceipt = (payment: Payment) => {
        if (payment.status !== 'completed') {
            toast.error('Receipt only available for completed payments');
            return;
        }

        window.open(`/taxpayer/payments/${payment.id}/receipt`, '_blank');
    };

    const getPaymentMethodIcon = (method?: PaymentMethod | string) => {
        const type = typeof method === 'object' ? method?.type : method;
        
        switch (type) {
            case 'mobile_money':
                return <Smartphone className="w-4 h-4" />;
            case 'card':
                return <CreditCard className="w-4 h-4" />;
            case 'bank_transfer':
                return <Landmark className="w-4 h-4" />;
            default:
                return <CreditCard className="w-4 h-4" />;
        }
    };

    const getPaymentMethodLabel = (method?: PaymentMethod | string) => {
        if (typeof method === 'object' && method?.name) {
            return method.name;
        }
        
        switch (method) {
            case 'mobile_money':
                return 'Mobile Money';
            case 'card':
                return 'Card Payment';
            case 'bank_transfer':
                return 'Bank Transfer';
            default:
                return method || 'Unknown';
        }
    };

    const getPaymentProviderDisplay = (payment: Payment): string | null => {
        if (payment.payment_provider) {
            return payment.payment_provider;
        }
        
        const response = payment.payment_provider_response;
        if (response?.phone_number) {
            return response.phone_number;
        }
        if (response?.bank_name) {
            return response.bank_name;
        }
        if (response?.card_provider) {
            return response.card_provider;
        }
        
        return null;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700';
            case 'pending': return 'bg-blue-100 text-blue-700';
            case 'failed': return 'bg-red-100 text-red-700';
            case 'refunded': return 'bg-purple-100 text-purple-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-3 h-3" />;
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'failed': return <XCircle className="w-3 h-3" />;
            case 'refunded': return <RefreshCw className="w-3 h-3" />;
            default: return <AlertCircle className="w-3 h-3" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Payment History</h1>
                        <p className="text-sm text-slate-500">View and manage all your payment transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={refreshData}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors shadow-md"
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="bg-gradient-to-br from-[#003366] to-[#002244] rounded-xl p-4 text-white shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/70">Total Payments</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-white/30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/70">Completed</p>
                                <p className="text-2xl font-bold">{stats.completed}</p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-white/30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/70">Pending</p>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                            </div>
                            <Clock className="w-8 h-8 text-white/30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/70">Total Amount</p>
                                <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                            </div>
                            <FileText className="w-8 h-8 text-white/30" />
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by invoice, order number, or transaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Active Filters */}
                {(statusFilter !== 'all' || methodFilter !== 'all' || dateFrom || dateTo) && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500">Active filters:</span>
                        {statusFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                                Status: {statusFilter}
                                <button onClick={() => setStatusFilter('all')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {methodFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                                Method: {paymentMethods.find(m => m.id === methodFilter)?.name || methodFilter}
                                <button onClick={() => setMethodFilter('all')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {(dateFrom || dateTo) && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                                Date: {dateFrom || 'any'} to {dateTo || 'any'}
                                <button onClick={() => { setDateFrom(''); setDateTo(''); }}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={resetFilters}
                            className="text-xs text-[#003366] hover:underline"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Payments Table */}
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Transaction History</h2>
                    </div>

                    {!payments?.data?.length ? (
                        <div className="p-12 text-center">
                            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-600 mb-2">No payments found</h3>
                            <p className="text-sm text-slate-400 mb-4">
                                {searchTerm || statusFilter !== 'all' || methodFilter !== 'all' || dateFrom || dateTo
                                    ? 'No payments match your filters. Try adjusting your search criteria.'
                                    : "You haven't made any payments yet."}
                            </p>
                            {!searchTerm && statusFilter === 'all' && methodFilter === 'all' && !dateFrom && !dateTo && (
                                <Link
                                    href="/taxpayer/orders"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    View Orders
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Invoice</th>
                                            <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Order</th>
                                            <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Date</th>
                                            <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Method</th>
                                            <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Amount</th>
                                            <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Status</th>
                                            <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {payments.data.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{payment.invoice_number}</p>
                                                        {payment.transaction_id && (
                                                            <p className="text-xs text-slate-500">TXN: {payment.transaction_id.substring(0, 8)}...</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/taxpayer/orders/${payment.order?.order_number}`}
                                                        className="text-sm text-[#003366] hover:underline"
                                                    >
                                                        {payment.order?.order_number}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm text-slate-600">
                                                            {payment.payment_date ? formatDate(payment.payment_date) : formatDate(payment.created_at)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {getPaymentMethodIcon(payment.paymentMethod)}
                                                        <span className="text-sm text-slate-600">
                                                            {getPaymentMethodLabel(payment.paymentMethod)}
                                                        </span>
                                                    </div>
                                                    {getPaymentProviderDisplay(payment) && (
                                                        <p className="text-xs text-slate-400 mt-1">{getPaymentProviderDisplay(payment)}</p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {formatCurrency(payment.total_amount || payment.amount)}
                                                    </p>
                                                    {(payment.tax_amount > 0 || payment.penalty_amount > 0) && (
                                                        <p className="text-xs text-slate-400">
                                                            Tax: {formatCurrency(payment.tax_amount)}
                                                            {payment.penalty_amount > 0 && ` + Penalty: ${formatCurrency(payment.penalty_amount)}`}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                        {getStatusIcon(payment.status)}
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => viewPaymentDetails(payment)}
                                                            className="p-1.5 text-slate-400 hover:text-[#003366] hover:bg-[#003366]/10 rounded transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {payment.status === 'completed' && (
                                                            <button
                                                                onClick={() => downloadReceipt(payment)}
                                                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                                                title="Download Receipt"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {payments.last_page > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                                    <p className="text-sm text-slate-500">
                                        Showing {(payments.current_page - 1) * payments.per_page + 1} to{' '}
                                        {Math.min(payments.current_page * payments.per_page, payments.total)} of{' '}
                                        {payments.total} results
                                    </p>
                                    <div className="flex gap-2">
                                        {payments.links?.map((link: any, index: number) => {
                                            if (link.url === null) return null;
                                            
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => router.get(link.url, {}, { preserveState: true })}
                                                    className={`px-3 py-1 rounded text-sm ${
                                                        link.active
                                                            ? 'bg-[#003366] text-white'
                                                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Filter Payments</h3>
                                <p className="text-sm text-slate-500">Narrow down your payment history</p>
                            </div>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            {/* Payment Method Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                                <select
                                    value={methodFilter}
                                    onChange={(e) => setMethodFilter(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                >
                                    <option value="all">All Methods</option>
                                    {paymentMethods.map((method) => (
                                        <option key={method.id} value={method.id}>
                                            {method.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleFilterApply}
                                className="flex-1 px-4 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Details Modal */}
            {showDetailsModal && selectedPayment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Payment Details</h3>
                                <p className="text-sm text-slate-500">{selectedPayment.invoice_number}</p>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Status */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Status</span>
                                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                                    {getStatusIcon(selectedPayment.status)}
                                    {selectedPayment.status}
                                </span>
                            </div>

                            {/* Amount Breakdown */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Subtotal</span>
                                    <span className="text-sm">{formatCurrency(selectedPayment.amount)}</span>
                                </div>
                                {selectedPayment.tax_amount > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Tax</span>
                                        <span className="text-sm">{formatCurrency(selectedPayment.tax_amount)}</span>
                                    </div>
                                )}
                                {selectedPayment.penalty_amount > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Penalty</span>
                                        <span className="text-sm text-amber-600">{formatCurrency(selectedPayment.penalty_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                    <span className="text-sm font-medium text-slate-700">Total</span>
                                    <span className="text-lg font-bold text-[#003366]">
                                        {formatCurrency(selectedPayment.total_amount || selectedPayment.amount)}
                                    </span>
                                </div>
                            </div>

                            {/* Invoice */}
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Invoice</span>
                                <span className="text-sm font-medium">{selectedPayment.invoice_number}</span>
                            </div>

                            {/* Order */}
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Order Number</span>
                                <Link
                                    href={`/taxpayer/orders/${selectedPayment.order?.order_number}`}
                                    className="text-sm text-[#003366] hover:underline"
                                >
                                    {selectedPayment.order?.order_number}
                                </Link>
                            </div>

                            {/* Transaction ID */}
                            {selectedPayment.transaction_id && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Transaction ID</span>
                                    <span className="text-sm font-mono">{selectedPayment.transaction_id}</span>
                                </div>
                            )}

                            {/* Payment Method */}
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Payment Method</span>
                                <div className="flex items-center gap-2">
                                    {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                                    <span className="text-sm">{getPaymentMethodLabel(selectedPayment.paymentMethod)}</span>
                                </div>
                            </div>

                            {/* Provider Details from Response */}
                            {selectedPayment.payment_provider_response && (
                                <>
                                    {selectedPayment.payment_provider_response.phone_number && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600">Phone Number</span>
                                            <span className="text-sm">{selectedPayment.payment_provider_response.phone_number}</span>
                                        </div>
                                    )}
                                    
                                    {selectedPayment.payment_provider_response.bank_name && (
                                        <div className="border-t border-slate-100 pt-4 mt-2">
                                            <p className="text-sm font-medium text-slate-700 mb-2">Bank Details</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Bank:</span>
                                                    <span>{selectedPayment.payment_provider_response.bank_name}</span>
                                                </div>
                                                {selectedPayment.payment_provider_response.bank_account_number && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-600">Account:</span>
                                                        <span>{selectedPayment.payment_provider_response.bank_account_number}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {selectedPayment.payment_provider_response.card_provider && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600">Card Provider</span>
                                            <span className="text-sm">{selectedPayment.payment_provider_response.card_provider}</span>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Failure Reason */}
                            {selectedPayment.failure_reason && (
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <p className="text-xs text-red-700">{selectedPayment.failure_reason}</p>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="border-t border-slate-100 pt-4 mt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Payment Date</span>
                                    <span>{selectedPayment.payment_date ? formatDate(selectedPayment.payment_date) : 'N/A'}</span>
                                </div>
                                {selectedPayment.confirmation_date && (
                                    <div className="flex justify-between text-sm mt-2">
                                        <span className="text-slate-600">Confirmed</span>
                                        <span>{formatDate(selectedPayment.confirmation_date)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-slate-600">Created</span>
                                    <span>{formatDate(selectedPayment.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-slate-200">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Close
                            </button>
                            {selectedPayment.status === 'completed' && (
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        downloadReceipt(selectedPayment);
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Receipt
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}