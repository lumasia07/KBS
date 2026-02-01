import { Head } from '@inertiajs/react';
import {
    Users,
    FileText,
    CreditCard,
    Stamp,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowUpRight,
    Building2,
    ShieldCheck
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Portal',
        href: '/admin/dashboard',
    },
];

// Map icon strings to components
const iconMap: Record<string, any> = {
    Users,
    FileText,
    CreditCard,
    Stamp
};

type OrderStatusData = {
    label: string;
    value: number;
    color: string;
}[];

type MonthlyRevenueData = {
    month: string;
    value: number;
}[];

interface DashboardProps {
    stats: {
        title: string;
        value: string;
        change: string;
        trend: 'up' | 'down';
        icon: string;
        description: string;
    }[];
    orderStatusData: OrderStatusData;
    monthlyRevenue: MonthlyRevenueData;
    recentTransactions: {
        company: string;
        action: string;
        amount: string;
        time: string;
        status: 'success' | 'pending';
    }[];
}



// Quick actions
const quickActions = [
    { label: 'Approve Orders', icon: CheckCircle, count: 23, href: '#' },
    { label: 'Pending Verifications', icon: Clock, count: 12, href: '#' },
    { label: 'Active Complaints', icon: AlertCircle, count: 5, href: '#' },
    { label: 'New Registrations', icon: Building2, count: 8, href: '#' },
];

// Donut Chart Component
function DonutChart({ data, size = 120 }: { data: OrderStatusData; size?: number }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercent = 0;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
                {data.map((slice, index) => {
                    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                    cumulativePercent += slice.value / total;
                    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                    const largeArcFlag = slice.value / total > 0.5 ? 1 : 0;

                    const pathData = [
                        `M ${startX} ${startY}`,
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        `L 0 0`,
                    ].join(' ');

                    return (
                        <path
                            key={index}
                            d={pathData}
                            fill={slice.color}
                            className="transition-all duration-300 hover:opacity-80"
                        />
                    );
                })}
                <circle cx="0" cy="0" r="0.6" fill="white" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-900">{total}%</span>
                <span className="text-[10px] text-slate-500">Complete</span>
            </div>
        </div>
    );
}

// Bar Chart Component
function BarChart({ data }: { data: MonthlyRevenueData }) {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="flex items-end justify-between gap-3 h-40">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div className="text-xs font-medium text-slate-700">{item.value}M</div>
                    <div
                        className="w-full bg-gradient-to-t from-[#003366] to-[#0052A3] rounded-t-lg transition-all duration-500 hover:from-[#002244] hover:to-[#003366] min-h-[20px]"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                    />
                    <span className="text-xs font-medium text-slate-500">{item.month}</span>
                </div>
            ))}
        </div>
    );
}

export default function Dashboard({ stats, orderStatusData, monthlyRevenue, recentTransactions }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                        <p className="text-sm text-slate-500">Welcome back! Here's what's happening with KBS today.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>System Status: <span className="text-emerald-500 font-medium">Operational</span></span>
                    </div>
                </div>

                {/* Stats Grid - Blue Theme */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = iconMap[stat.icon] || AlertCircle;
                        return (
                            <div
                                key={index}
                                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003366] to-[#002244] p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                {/* Decorative circle */}
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full" />

                                <div className="relative flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white/70">{stat.title}</p>
                                        <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            {stat.trend === 'up' ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-red-400" />
                                            )}
                                            <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {stat.change}
                                            </span>
                                            <span className="text-xs text-white/50">vs last month</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-colors">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <p className="relative text-xs text-white/50 mt-3">{stat.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Order Status Donut */}
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6">Order Status</h2>
                        <div className="flex flex-col items-center">
                            <DonutChart data={orderStatusData} />
                            <div className="flex flex-wrap justify-center gap-4 mt-6">
                                {orderStatusData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm text-slate-600">{item.label}</span>
                                        <span className="text-sm font-medium text-slate-900">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Monthly Revenue Bar Chart */}
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-slate-900">Monthly Revenue</h2>
                            <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" /> +18.2%
                            </span>
                        </div>
                        <BarChart data={monthlyRevenue} />
                        <p className="text-xs text-slate-400 mt-4 text-center">Revenue in millions (CDF)</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {quickActions.map((action, index) => (
                                <a
                                    key={index}
                                    href={action.href}
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#003366]/10 flex items-center justify-center">
                                            <action.icon className="w-5 h-5 text-[#003366]" />
                                        </div>
                                        <span className="font-medium text-slate-900">{action.label}</span>
                                    </div>
                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#003366] text-white">
                                        {action.count}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Stamp Distribution */}
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Stamp Distribution by Type</h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Fiscal Stamps', value: 45, color: '#003366' },
                                { label: 'Commercial Stamps', value: 30, color: '#0052A3' },
                                { label: 'Import Stamps', value: 15, color: '#FFD700' },
                                { label: 'Export Stamps', value: 10, color: '#10B981' },
                            ].map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600">{item.label}</span>
                                        <span className="font-medium text-slate-900">{item.value}%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
                                <a href="#" className="text-sm text-[#003366] hover:underline flex items-center gap-1">
                                    View all <ArrowUpRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentTransactions.map((tx, index) => (
                                <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === 'success' ? 'bg-emerald-100' : 'bg-amber-100'
                                                }`}>
                                                {tx.status === 'success' ? (
                                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                ) : (
                                                    <Clock className="w-5 h-5 text-amber-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{tx.company}</p>
                                                <p className="text-sm text-slate-500">{tx.action}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-medium ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>
                                                {tx.amount}
                                            </p>
                                            <p className="text-xs text-slate-400">{tx.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
