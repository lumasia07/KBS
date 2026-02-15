import { Head, Link } from '@inertiajs/react';
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
    ShieldCheck,
    Package,
    BarChart3,
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Portal', href: '/admin/dashboard' },
];

const iconMap: Record<string, any> = { Users, FileText, CreditCard, Stamp };

// ── Types ──

type OrderStatusItem = { label: string; value: number; count: number; color: string };
type MonthlyRevenueItem = { month: string; value: number };
type StampDistributionItem = { label: string; value: number; color: string };

interface QuickActionCounts {
    pendingOrders: number;
    pendingVerifications: number;
    activeComplaints: number;
    newRegistrations: number;
    pendingProducts: number;
}

interface DashboardProps {
    stats: { title: string; value: string; change: string; trend: 'up' | 'down'; icon: string; description: string }[];
    orderStatusData: OrderStatusItem[];
    monthlyRevenue: MonthlyRevenueItem[];
    revenueTrend: string;
    quickActions: QuickActionCounts;
    stampDistribution: StampDistributionItem[];
    recentTransactions: { company: string; action: string; amount: string; time: string; status: 'success' | 'pending' }[];
}

// ── Donut Chart ──

function DonutChart({ data, size = 130 }: { data: OrderStatusItem[]; size?: number }) {
    const total = data.reduce((s, i) => s + i.value, 0);
    if (total === 0) {
        return (
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                <div className="rounded-full border-8 border-slate-100" style={{ width: size, height: size }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-slate-400">N/A</span>
                    <span className="text-[10px] text-slate-400">No data</span>
                </div>
            </div>
        );
    }
    let cum = 0;
    const c = (p: number) => [Math.cos(2 * Math.PI * p), Math.sin(2 * Math.PI * p)];
    const totalCount = data.reduce((s, i) => s + (i.count || 0), 0);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
                {data.map((slice, i) => {
                    const [sx, sy] = c(cum);
                    cum += slice.value / total;
                    const [ex, ey] = c(cum);
                    const lg = slice.value / total > 0.5 ? 1 : 0;
                    return <path key={i} d={`M ${sx} ${sy} A 1 1 0 ${lg} 1 ${ex} ${ey} L 0 0`} fill={slice.color} className="transition-all duration-300 hover:opacity-80" />;
                })}
                <circle cx="0" cy="0" r="0.6" fill="white" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-900">{totalCount}</span>
                <span className="text-[10px] text-slate-500">Total Orders</span>
            </div>
        </div>
    );
}

// ── Bar Chart ──

function BarChart({ data }: { data: MonthlyRevenueItem[] }) {
    const maxValue = Math.max(...data.map(d => d.value), 0.001);
    return (
        <div className="flex items-end justify-between gap-3 h-40">
            {data.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div className="text-xs font-medium text-slate-700">{item.value > 0 ? `${item.value}M` : '0'}</div>
                    <div
                        className="w-full bg-gradient-to-t from-[#003366] to-[#0052A3] rounded-t-lg transition-all duration-500 hover:from-[#002244] hover:to-[#003366] min-h-[4px]"
                        style={{ height: `${Math.max((item.value / maxValue) * 100, 2)}%` }}
                    />
                    <span className="text-xs font-medium text-slate-500">{item.month}</span>
                </div>
            ))}
        </div>
    );
}

// ── Quick Actions Config ──

const quickActionConfig = [
    { key: 'pendingOrders' as const, label: 'Approve Orders', icon: CheckCircle, href: '/admin/orders' },
    { key: 'pendingVerifications' as const, label: 'Production Queue', icon: Clock, href: '/admin/production' },
    { key: 'pendingProducts' as const, label: 'Product Requests', icon: Package, href: '/admin/products/requests' },
    { key: 'newRegistrations' as const, label: 'New Registrations', icon: Building2, href: '/admin/taxpayers' },
    { key: 'activeComplaints' as const, label: 'Active Complaints', icon: AlertCircle, href: '#' },
];

// ── Main Component ──

export default function Dashboard({
    stats,
    orderStatusData = [],
    monthlyRevenue = [],
    revenueTrend = '0%',
    quickActions: qa = { pendingOrders: 0, pendingVerifications: 0, activeComplaints: 0, newRegistrations: 0, pendingProducts: 0 },
    stampDistribution = [],
    recentTransactions = [],
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Welcome back! Here's what's happening with KBS today.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>System Status: <span className="text-emerald-600 font-semibold">Operational</span></span>
                    </div>
                </div>

                {/* KPI Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = iconMap[stat.icon] || BarChart3;
                        return (
                            <div key={index} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003366] to-[#002244] p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full" />
                                <div className="relative flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white/70">{stat.title}</p>
                                        <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            {stat.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                                            <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>{stat.change}</span>
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

                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Order Status Donut */}
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6">Order Status</h2>
                        {orderStatusData.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-10">No orders yet.</p>
                        ) : (
                            <div className="flex flex-col items-center">
                                <DonutChart data={orderStatusData} />
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6">
                                    {orderStatusData.map((item, i) => (
                                        <div key={i} className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-xs text-slate-600">{item.label}</span>
                                            <span className="text-xs font-semibold text-slate-900">{item.count ?? item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Monthly Revenue */}
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-slate-900">Monthly Revenue</h2>
                            <span className={`text-sm font-medium flex items-center gap-1 ${revenueTrend.startsWith('-') ? 'text-red-500' : 'text-emerald-600'}`}>
                                {revenueTrend.startsWith('-') ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                {revenueTrend}
                            </span>
                        </div>
                        {monthlyRevenue.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-10">No revenue data.</p>
                        ) : (
                            <>
                                <BarChart data={monthlyRevenue} />
                                <p className="text-xs text-slate-400 mt-4 text-center">Revenue in millions (CDF)</p>
                            </>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                        </div>
                        <div className="p-4 space-y-2 flex-1">
                            {quickActionConfig.map((action, i) => {
                                const count = qa[action.key] ?? 0;
                                return (
                                    <Link key={i} href={action.href} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-[#003366]/10 flex items-center justify-center">
                                                <action.icon className="w-4.5 h-4.5 text-[#003366]" />
                                            </div>
                                            <span className="font-medium text-sm text-slate-900">{action.label}</span>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${count > 0 ? 'bg-[#003366] text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            {count}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Stamp Distribution */}
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Stamp Distribution by Type</h2>
                        {stampDistribution.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-8">No stamp type data available.</p>
                        ) : (
                            <div className="space-y-4">
                                {stampDistribution.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="text-slate-600">{item.label}</span>
                                            <span className="font-semibold text-slate-900">{item.value}%</span>
                                        </div>
                                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                                <Link href="/admin/orders" className="text-sm text-[#003366] hover:underline flex items-center gap-1">
                                    View all <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                        {recentTransactions.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center p-8">
                                <p className="text-sm text-slate-400">No recent activity.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentTransactions.map((tx, i) => (
                                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.status === 'success' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                                    {tx.status === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-amber-600" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-slate-900">{tx.company}</p>
                                                    <p className="text-xs text-slate-500">{tx.action}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm text-slate-900">{tx.amount}</p>
                                                <p className="text-xs text-slate-400">{tx.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
