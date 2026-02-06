import { Head, Link } from '@inertiajs/react';
import {
    MapPin,
    ClipboardCheck,
    Stamp,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Clock,
    ArrowUpRight,
    Target,
    AlertTriangle,
    Navigation,
    CheckSquare,
    XCircle,
    Plus
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Agent Portal',
        href: '/agent/dashboard',
    },
];

interface Stats {
    today_inspections: number;
    completed: number;
    violations: number;
    stamps_verified: number;
}

interface ScheduleItem {
    id: string;
    time: string;
    company: string;
    address: string;
    type: string;
    status: string;
}

interface InspectionItem {
    id: string;
    company: string;
    result: string;
    stampsVerified: number;
    violations: number;
    date: string;
}

interface Props {
    stats?: Stats;
    todaySchedule?: ScheduleItem[];
    recentInspections?: InspectionItem[];
}

// Quick actions for agent - bank app style
const quickActions = [
    { label: 'Inspect', icon: ClipboardCheck, href: '/agent/inspections/create', color: 'bg-blue-500' },
    { label: 'History', icon: Target, href: '/agent/inspections', color: 'bg-emerald-500' },
    { label: 'Report', icon: AlertTriangle, href: '#', color: 'bg-red-500' },
    { label: 'Route', icon: Navigation, href: '#', color: 'bg-purple-500' },
];

export default function AgentDashboard({
    stats = { today_inspections: 0, completed: 0, violations: 0, stamps_verified: 0 },
    todaySchedule = [],
    recentInspections = []
}: Props) {

    const statCards = [
        {
            title: "Today's Inspections",
            value: stats.today_inspections.toString(),
            change: '',
            trend: 'up',
            icon: ClipboardCheck,
        },
        {
            title: 'Completed',
            value: stats.completed.toString(),
            change: '',
            trend: 'up',
            icon: CheckCircle,
        },
        {
            title: 'Violations Found',
            value: stats.violations.toString(),
            change: '',
            trend: 'down',
            icon: AlertTriangle,
        },
        {
            title: 'Items Verified',
            value: stats.stamps_verified.toString(),
            change: '',
            trend: 'up',
            icon: Stamp,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agent Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                {/* Header with Welcome and Quick Actions */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Field Operations</h1>
                        <p className="text-sm text-slate-500">Your daily inspection schedule and field activities.</p>
                    </div>

                    {/* Quick Actions - Bank App Style */}
                    <div className="flex items-center gap-6">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={`w-14 h-14 rounded-full ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stats Grid - Dark Blue Theme matching header */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => (
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
                                </div>
                                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Today's Schedule - Full Width */}
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Today's Schedule</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">{todaySchedule.length} inspections</span>
                                <Link href="/agent/inspections/create" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> New
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {todaySchedule.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <ClipboardCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                <p>No inspections scheduled for today.</p>
                                <Link href="/agent/inspections/create" className="text-blue-600 hover:underline mt-2 inline-block">
                                    Start a new inspection
                                </Link>
                            </div>
                        ) : (
                            todaySchedule.map((item, index) => (
                                <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 text-center">
                                            <span className="text-sm font-bold text-slate-900">{item.time}</span>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${item.status === 'completed' ? 'bg-emerald-500' :
                                            item.status === 'in_progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
                                            }`} />
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{item.company}</p>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <MapPin className="w-3 h-3" />
                                                <span>{item.address}</span>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                            {item.type}
                                        </span>
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                            item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {item.status === 'completed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                            {item.status === 'in_progress' && <Clock className="w-3 h-3 inline mr-1" />}
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Inspections - Full Width */}
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Recent Inspections</h2>
                            <Link href="/agent/inspections" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                View all <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentInspections.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <CheckSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                <p>No completed inspections yet.</p>
                            </div>
                        ) : (
                            recentInspections.map((inspection, index) => (
                                <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inspection.result === 'passed' ? 'bg-emerald-100' : 'bg-red-100'
                                                }`}>
                                                {inspection.result === 'passed' ? (
                                                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{inspection.company}</p>
                                                <p className="text-sm text-slate-500">
                                                    {inspection.stampsVerified} items • {inspection.violations} violations
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-400">{inspection.date}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
