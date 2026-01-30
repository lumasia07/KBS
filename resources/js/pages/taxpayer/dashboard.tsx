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

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Taxpayer Portal',
        href: '/taxpayer/dashboard',
    },
];

// Mock stats for taxpayer
const stats = [
    {
        title: 'My Orders',
        value: '24',
        change: '+3',
        trend: 'up',
        icon: Package,
        description: 'Total stamp orders',
    },
    {
        title: 'Pending Approvals',
        value: '3',
        change: '-2',
        trend: 'down',
        icon: Clock,
        description: 'Awaiting processing',
    },
    {
        title: 'Total Spent (CDF)',
        value: '2.4M',
        change: '+15.2%',
        trend: 'up',
        icon: CreditCard,
        description: 'This year',
    },
    {
        title: 'Active Stamps',
        value: '456',
        change: '+12',
        trend: 'up',
        icon: Stamp,
        description: 'In my inventory',
    },
];

// Order history
const orderHistory = [
    { id: 'ORD-2024-001', type: 'Fiscal Stamps', quantity: 100, amount: '250,000 CDF', status: 'delivered', date: 'Jan 15, 2024' },
    { id: 'ORD-2024-002', type: 'Commercial Stamps', quantity: 50, amount: '175,000 CDF', status: 'processing', date: 'Jan 20, 2024' },
    { id: 'ORD-2024-003', type: 'Import Stamps', quantity: 25, amount: '125,000 CDF', status: 'pending', date: 'Jan 22, 2024' },
    { id: 'ORD-2024-004', type: 'Fiscal Stamps', quantity: 200, amount: '500,000 CDF', status: 'delivered', date: 'Jan 10, 2024' },
    { id: 'ORD-2024-005', type: 'Export Stamps', quantity: 75, amount: '300,000 CDF', status: 'delivered', date: 'Jan 5, 2024' },
];

// Quick actions for taxpayer - bank app style
const quickActions = [
    { label: 'New Order', icon: Package, href: '/taxpayer/order', color: 'bg-emerald-500' },
    { label: 'Pay', icon: CreditCard, href: '#', color: 'bg-blue-500' },
    { label: 'Certificates', icon: FileCheck, href: '#', color: 'bg-purple-500' },
    { label: 'History', icon: History, href: '#', color: 'bg-orange-500' },
    { label: 'Support', icon: AlertTriangle, href: '#', color: 'bg-red-500' },
];

export default function TaxpayerDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Taxpayer Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                {/* Header with Welcome and Quick Actions */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome Back!</h1>
                        <p className="text-sm text-slate-500">Manage your stamps, orders, and compliance status.</p>
                    </div>

                    {/* Quick Actions - Bank App Style */}
                    <div className="flex items-center gap-6">
                        {quickActions.map((action, index) => (
                            <a
                                key={index}
                                href={action.href}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={`w-14 h-14 rounded-full ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{action.label}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Stats Grid - Dark Blue Theme matching header */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#003366] to-[#002244] p-4 shadow-md hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Decorative circle */}
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />

                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-white/70">{stat.title}</p>
                                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {stat.trend === 'up' ? (
                                            <TrendingUp className="w-3 h-3 text-blue-300" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 text-blue-300" />
                                        )}
                                        <span className="text-xs font-medium text-blue-300">
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders - Full Width */}
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                            <a href="#" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                                View all <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Order ID</th>
                                    <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Type</th>
                                    <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Quantity</th>
                                    <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Amount</th>
                                    <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Status</th>
                                    <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Date</th>
                                    <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orderHistory.map((order, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{order.type}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{order.quantity}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${order.status === 'delivered'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : order.status === 'processing'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {order.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                                                {order.status === 'processing' && <Clock className="w-3 h-3" />}
                                                {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {order.status === 'delivered' && (
                                                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
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
                </div>
            </div>
        </AppLayout>
    );
}
