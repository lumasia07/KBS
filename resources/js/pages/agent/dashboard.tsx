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
    ScanLine,
    CheckSquare,
    XCircle,
    Plus
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useI18nStore } from '@/stores/useI18nStore';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: useI18nStore.getState().t('agent.dashboard.breadcrumb'),
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
    { label: useI18nStore.getState().t('agent.dashboard.inspect'), icon: ClipboardCheck, href: '/agent/inspections/create', color: 'bg-blue-500' },
    { label: useI18nStore.getState().t('agent.dashboard.scan'), icon: ScanLine, href: '/agent/scanner', color: 'bg-violet-500' },
    { label: useI18nStore.getState().t('agent.dashboard.history'), icon: Target, href: '/agent/inspections', color: 'bg-emerald-500' },
];

export default function AgentDashboard({
    stats = { today_inspections: 0, completed: 0, violations: 0, stamps_verified: 0 },
    todaySchedule = [],
    recentInspections = []
}: Props) {
    const { t } = useI18nStore();

    const statCards = [
        {
            title: t('agent.dashboard.todayInspections'),
            value: stats.today_inspections.toString(),
            change: '',
            trend: 'up',
            icon: ClipboardCheck,
        },
        {
            title: t('agent.dashboard.completed'),
            value: stats.completed.toString(),
            change: '',
            trend: 'up',
            icon: CheckCircle,
        },
        {
            title: t('agent.dashboard.violationsFound'),
            value: stats.violations.toString(),
            change: '',
            trend: 'down',
            icon: AlertTriangle,
        },
        {
            title: t('agent.dashboard.itemsVerified'),
            value: stats.stamps_verified.toString(),
            change: '',
            trend: 'up',
            icon: Stamp,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('agent.dashboard.headTitle')} />

            <div className="flex h-full flex-1 flex-col gap-4 bg-slate-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:gap-6 sm:p-6 sm:pb-6">
                {/* Header with Welcome and Quick Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('agent.dashboard.title')}</h1>
                        <p className="text-sm text-slate-500">{t('agent.dashboard.subtitle')}</p>
                    </div>

                    {/* Quick Actions - Bank App Style */}
                    <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="group flex flex-col items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm transition-all hover:shadow md:bg-transparent md:p-0 md:shadow-none"
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.color} shadow-md transition-transform duration-200 group-hover:scale-110 sm:h-14 sm:w-14 sm:rounded-full sm:shadow-lg`}>
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-center text-[11px] font-medium text-slate-600 group-hover:text-slate-900 sm:text-xs">{action.label}</span>
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
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">{t('agent.dashboard.todaySchedule')}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">{todaySchedule.length} {t('agent.dashboard.inspectionsCount')}</span>
                                <Link href="/agent/inspections/create" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> {t('agent.dashboard.new')}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {todaySchedule.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <ClipboardCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                <p>{t('agent.dashboard.noScheduled')}</p>
                                <Link href="/agent/inspections/create" className="text-blue-600 hover:underline mt-2 inline-block">
                                    {t('agent.dashboard.startNew')}
                                </Link>
                            </div>
                        ) : (
                            todaySchedule.map((item, index) => (
                                <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="grid grid-cols-[auto_1fr] gap-3 sm:flex sm:items-center sm:gap-4">
                                        <div className="w-14 text-left sm:w-16 sm:text-center">
                                            <span className="text-sm font-bold text-slate-900">{item.time}</span>
                                        </div>
                                        <div className={`h-2 w-2 self-center rounded-full ${item.status === 'completed' ? 'bg-emerald-500' :
                                            item.status === 'in_progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
                                            }`} />
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{item.company}</p>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <MapPin className="w-3 h-3" />
                                                <span>{item.address}</span>
                                            </div>
                                        </div>
                                        <span className="justify-self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:justify-self-auto">
                                            {item.type}
                                        </span>
                                        <span className={`justify-self-start rounded-full px-3 py-1.5 text-xs font-medium sm:justify-self-auto ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
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
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">{t('agent.dashboard.recentInspections')}</h2>
                            <Link href="/agent/inspections" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                {t('agent.dashboard.viewAll')} <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentInspections.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <CheckSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                <p>{t('agent.dashboard.noCompleted')}</p>
                            </div>
                        ) : (
                            recentInspections.map((inspection, index) => (
                                <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                                                    {inspection.stampsVerified} {t('agent.dashboard.items')} • {inspection.violations} {t('agent.dashboard.violations')}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="pl-13 text-xs text-slate-400 sm:pl-0 sm:text-sm">{inspection.date}</span>
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
