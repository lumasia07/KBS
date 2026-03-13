import { Head } from '@inertiajs/react';
import {
    CreditCard,
    Stamp,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Clock,
    ArrowUpRight,
    Package,
    FileCheck,
    AlertTriangle,
    Download,
    Eye,
    History
} from 'lucide-react';
import { useState, useMemo } from 'react';

import AppLayout from '@/layouts/app-layout';
import { useI18nStore } from '@/stores/useI18nStore';
import { type BreadcrumbItem } from '@/types';

// Define interfaces with optional fields for safety
interface Taxpayer {
    id?: number;
    name?: string;
    company_name?: string;
    email?: string;
    tax_identification_number?: string;
}

interface Stats {
    totalOrders?: number;
    pendingOrders?: number;
    totalSpent?: {
        current?: number;
        previous?: number;
        change?: number;
    };
    activeStamps?: {
        current?: number;
        previous?: number;
        change?: number;
    };
}

interface RecentOrder {
    id: string;
    order_number: string;
    type: string;
    quantity: number;
    amount: number;
    status: 'pending' | 'processing' | 'delivered' | 'rejected';
    created_at: string;
    can_download: boolean;
}

interface QuickActions {
    canPlaceOrder?: boolean;
    hasPendingPayments?: boolean;
    certificatesAvailable?: boolean;
}

interface YearlyComparison {
    orders?: number;
    spent?: number;
}

interface TaxpayerDashboardProps {
    taxpayer?: Taxpayer;
    stats?: Stats;
    recentOrders?: RecentOrder[];
    quickActions?: QuickActions;
    yearlyComparison?: YearlyComparison;
}

// Breadcrumbs are built inside the component to access translations

// Helper function to format currency
const formatCurrency = (amount: number = 0): string => {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
};

// Helper function to format number with commas
const formatNumber = (num: number = 0): string => {
    return new Intl.NumberFormat().format(num);
};

// Helper function to calculate percentage change
const calculateChange = (current: number = 0, previous: number = 0): { value: string; trend: 'up' | 'down' | 'neutral' } => {
    if (previous === 0) {
        return current > 0 ? { value: '+100%', trend: 'up' } : { value: '0%', trend: 'neutral' };
    }
    const change = ((current - previous) / previous) * 100;
    const formattedChange = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    return {
        value: formattedChange,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
};

// Helper function to format date
const formatDate = (dateString: string): string => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return 'Invalid Date';
    }
};

// Status badge component with i18n
const StatusBadge = ({ status }: { status: string }) => {
    const { t } = useI18nStore();
    const statusConfig = {
        delivered: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle, label: t('statuses.delivered') },
        processing: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock, label: t('statuses.processing') },
        pending: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock, label: t('statuses.pending') },
        rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle, label: t('statuses.rejected') },
        ready_for_delivery: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle, label: t('statuses.readyForDelivery') },
        pending_payment: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock, label: t('statuses.pendingPayment') },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
};

// Skeleton Loader Component for better UX
const StatsSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 p-4 animate-pulse h-32" />
        ))}
    </div>
);

export default function TaxpayerDashboard(props: TaxpayerDashboardProps) {
    const { t, language } = useI18nStore();

    // Provide default values to prevent undefined errors
    const {
        taxpayer = {},
        stats = {},
        recentOrders = [],
        quickActions = {},
        yearlyComparison = {}
    } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('taxpayer.portalName'), href: '/taxpayer/dashboard' },
    ];

    // Safe destructuring with defaults
    const {
        totalOrders = 0,
        pendingOrders = 0,
        totalSpent = { current: 0, previous: 0, change: 0 },
        activeStamps = { current: 0, previous: 0, change: 0 }
    } = stats;

    const {
        canPlaceOrder = true,
        hasPendingPayments = false,
        certificatesAvailable = false
    } = quickActions;

    const {
        orders: yearlyOrders = 0,
        spent: yearlySpent = 0
    } = yearlyComparison;

    // Calculate stats with trends
    const statsData = useMemo(() => [
        {
            title: t('taxpayer.dashboard.stats.myOrders'),
            value: formatNumber(totalOrders),
            change: calculateChange(totalOrders, yearlyOrders).value,
            trend: calculateChange(totalOrders, yearlyOrders).trend,
            icon: Package,
            description: t('taxpayer.dashboard.stats.myOrdersDesc'),
        },
        {
            title: t('taxpayer.dashboard.stats.pendingApprovals'),
            value: formatNumber(pendingOrders),
            change: calculateChange(pendingOrders, pendingOrders * 1.1).value,
            trend: calculateChange(pendingOrders, pendingOrders * 1.1).trend,
            icon: Clock,
            description: t('taxpayer.dashboard.stats.pendingApprovalsDesc'),
        },
        {
            title: t('taxpayer.dashboard.stats.totalSpent'),
            value: formatCurrency(totalSpent.current),
            change: calculateChange(totalSpent.current, totalSpent.previous).value,
            trend: calculateChange(totalSpent.current, totalSpent.previous).trend,
            icon: CreditCard,
            description: t('taxpayer.dashboard.stats.totalSpentDesc'),
        },
        {
            title: t('taxpayer.dashboard.stats.activeStamps'),
            value: formatNumber(activeStamps.current),
            change: calculateChange(activeStamps.current, activeStamps.previous).value,
            trend: calculateChange(activeStamps.current, activeStamps.previous).trend,
            icon: Stamp,
            description: t('taxpayer.dashboard.stats.activeStampsDesc'),
        },
    ], [totalOrders, pendingOrders, totalSpent, activeStamps, yearlyOrders, language]);

    // Quick actions configuration based on real data
    const quickActionsConfig = useMemo(() => [
        {
            label: t('taxpayer.dashboard.quickActions.newOrder'),
            icon: Package,
            href: '/taxpayer/orders/create',
            color: 'bg-emerald-500 hover:bg-emerald-600',
            disabled: !canPlaceOrder,
            tooltip: t('taxpayer.dashboard.quickActions.newOrderTooltip')
        },
        {
            label: t('taxpayer.dashboard.quickActions.pay'),
            icon: CreditCard,
            href: hasPendingPayments ? '/taxpayer/payments' : '#',
            color: 'bg-blue-500 hover:bg-blue-600',
            badge: hasPendingPayments ? '!' : null,
            disabled: !hasPendingPayments,
            tooltip: t('taxpayer.dashboard.quickActions.payTooltip')
        },
        {
            label: t('taxpayer.dashboard.quickActions.certificates'),
            icon: FileCheck,
            href: certificatesAvailable ? '/taxpayer/certificates' : '#',
            color: 'bg-purple-500 hover:bg-purple-600',
            disabled: !certificatesAvailable,
            tooltip: t('taxpayer.dashboard.quickActions.certificatesTooltip')
        },
        {
            label: t('taxpayer.dashboard.quickActions.history'),
            icon: History,
            href: '/taxpayer/orders?view=history',
            color: 'bg-orange-500 hover:bg-orange-600',
            tooltip: t('taxpayer.dashboard.quickActions.historyTooltip')
        },
        {
            label: t('taxpayer.dashboard.quickActions.support'),
            icon: AlertTriangle,
            href: '/help',
            color: 'bg-red-500 hover:bg-red-600',
            tooltip: t('taxpayer.dashboard.quickActions.supportTooltip')
        },
    ], [canPlaceOrder, hasPendingPayments, certificatesAvailable, language]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Taxpayer Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50 dark:bg-slate-900">
                {/* Header with Welcome and Quick Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                            {t('taxpayer.dashboard.welcome').replace('{name}', taxpayer.company_name || taxpayer.name || 'Taxpayer')}
                        </h1>
                        {taxpayer.tax_identification_number && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {t('taxpayer.dashboard.taxIdLabel').replace('{tin}', taxpayer.tax_identification_number)}
                            </p>
                        )}
                    </div>

                    {/* Quick Actions - Responsive Grid */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        {quickActionsConfig.map((action, index) => (
                            <a
                                key={index}
                                href={action.href}
                                className={`flex flex-col items-center gap-2 group ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                                onClick={(e) => {
                                    if (action.disabled) {
                                        e.preventDefault();
                                        // You could show a toast notification here
                                    }
                                }}
                                title={action.tooltip}
                            >
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 relative`}>
                                    <action.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    {action.badge && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                            {action.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                                    {action.label}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {statsData.map((stat, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#003366] to-[#002244] p-4 shadow-md hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Decorative circle */}
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />

                            <div className="relative flex items-center justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-white/70 truncate">{stat.title}</p>
                                    <p className="text-xl md:text-2xl font-bold text-white mt-1 truncate">{stat.value}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {stat.trend === 'up' ? (
                                            <TrendingUp className="w-3 h-3 text-blue-300 flex-shrink-0" />
                                        ) : stat.trend === 'down' ? (
                                            <TrendingDown className="w-3 h-3 text-blue-300 flex-shrink-0" />
                                        ) : (
                                            <div className="w-3 h-3" /> // Placeholder for neutral
                                        )}
                                        <span className="text-xs font-medium text-blue-300 truncate">
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors ml-2 flex-shrink-0">
                                    <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                            </div>
                            <p className="relative text-[10px] text-white/50 mt-2 truncate">{stat.description}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Orders - Full Width with Responsive Table */}
                <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">{t('taxpayer.dashboard.recentOrders.title')}</h2>
                            <a href="/taxpayer/orders?view=history" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                                {t('taxpayer.dashboard.recentOrders.viewAll')} <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Desktop Table View - Hidden on mobile */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-300 px-6 py-3">{t('taxpayer.dashboard.table.orderNumber')}</th>
                                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-300 px-6 py-3">{t('taxpayer.dashboard.table.type')}</th>
                                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-300 px-6 py-3">{t('taxpayer.dashboard.table.quantity')}</th>
                                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-300 px-6 py-3">{t('taxpayer.dashboard.table.amount')}</th>
                                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-300 px-6 py-3">{t('taxpayer.dashboard.table.status')}</th>
                                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-300 px-6 py-3">{t('taxpayer.dashboard.table.date')}</th>
                                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-300 px-6 py-3">{t('taxpayer.dashboard.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                                {order.order_number}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{order.type}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                {formatNumber(order.quantity)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                                {formatCurrency(order.amount)} FC
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`/taxpayer/orders/${order.id}`}
                                                        className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded transition-colors"
                                                        title="View order details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                    {order.can_download && (
                                                        <a
                                                            href={`/taxpayer/orders/${order.id}/download`}
                                                            className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded transition-colors"
                                                            title="Download certificate"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                            {t('taxpayer.dashboard.recentOrders.emptyState')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <div key={order.id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {order.order_number}
                                        </span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{t('taxpayer.dashboard.table.type')}</p>
                                            <p className="text-slate-900 dark:text-white">{order.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{t('taxpayer.dashboard.table.quantity')}</p>
                                            <p className="text-slate-900 dark:text-white">{formatNumber(order.quantity)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{t('taxpayer.dashboard.table.amount')}</p>
                                            <p className="font-medium text-slate-900 dark:text-white">{formatCurrency(order.amount)} FC</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{t('taxpayer.dashboard.table.date')}</p>
                                            <p className="text-slate-900 dark:text-white">{formatDate(order.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <a
                                            href={`/taxpayer/orders/${order.id}`}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </a>
                                        {order.can_download && (
                                            <a
                                                href={`/taxpayer/orders/${order.id}/download`}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                {t('taxpayer.dashboard.recentOrders.emptyState')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}