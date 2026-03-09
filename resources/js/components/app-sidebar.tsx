import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    FileText,
    CreditCard,
    ShieldCheck,
    BarChart3,
    Settings,
    HelpCircle,
    Stamp,
    Package,
    ClipboardCheck,
    MapPin,
    Target,
    FileCheck,
    History,
    AlertTriangle,
    Printer
} from 'lucide-react';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useI18nStore } from '@/stores/useI18nStore';
import { type NavItem, type SharedData } from '@/types';

import AppLogo from './app-logo';

function getDashboardUrlForUserType(userType: string | undefined): string {
    switch (userType) {
        case 'taxpayer':
            return '/taxpayer/dashboard';
        case 'control_agent':
            return '/agent/dashboard';
        case 'admin':
        case 'finance':
        default:
            return '/admin/dashboard';
    }
}

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const { t, language } = useI18nStore();
    const userType = auth?.user?.user_type as string | undefined;
    const dashboardUrl = getDashboardUrlForUserType(userType);

    // Build translated nav items based on user type
    const navItems: NavItem[] = (() => {
        switch (userType) {
            case 'taxpayer':
                return [
                    { title: t('taxpayer.sidebar.dashboard'), href: '/taxpayer/dashboard', icon: LayoutGrid },
                    { title: t('taxpayer.sidebar.myProducts'), href: '/taxpayer/products', icon: Package },
                    { title: t('taxpayer.sidebar.myOrders'), href: '/taxpayer/orders', icon: FileText },
                    { title: t('taxpayer.sidebar.payments'), href: '/taxpayer/payments', icon: CreditCard },
                    { title: t('taxpayer.sidebar.orderHistory'), href: '/taxpayer/orders?view=history', icon: History },
                ];
            case 'control_agent':
                return [
                    { title: t('admin.sidebar.dashboard'), href: '/agent/dashboard', icon: LayoutGrid },
                    { title: t('admin.sidebar.myInspections'), href: '/agent/inspections', icon: ClipboardCheck },
                    { title: t('admin.sidebar.newInspection'), href: '/agent/inspections/create', icon: MapPin },
                ];
            default:
                return [
                    { title: t('admin.sidebar.dashboard'), href: '/admin/dashboard', icon: LayoutGrid },
                    { title: t('admin.sidebar.taxpayers'), href: '/admin/taxpayers', icon: Users },
                    { title: t('admin.sidebar.stampOrders'), href: '/admin/orders', icon: FileText },
                    { title: t('admin.sidebar.productRequests'), href: '/admin/products/requests', icon: Package },
                    { title: t('admin.sidebar.payments'), href: '/admin/payments', icon: CreditCard },
                    { title: t('admin.sidebar.fieldControl'), href: '/admin/field-controls', icon: ShieldCheck },
                    { title: t('admin.sidebar.reports'), href: '/admin/reports', icon: BarChart3 },
                    { title: t('admin.sidebar.production'), href: '/admin/production', icon: Printer },
                ];
        }
    })();

    const footerNavItems: NavItem[] = [
        { title: t('common.settings'), href: '/settings/profile', icon: Settings },
        { title: t('common.helpSupport'), href: '/help', icon: HelpCircle },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
