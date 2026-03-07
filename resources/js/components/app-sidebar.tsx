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
import { type NavItem, type SharedData } from '@/types';

import AppLogo from './app-logo';

// Admin navigation items
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Taxpayers',
        href: '/admin/taxpayers',
        icon: Users,
    },
    {
        title: 'Stamp Orders',
        href: '/admin/orders',
        icon: FileText,
    },
    {
        title: 'Product Requests',
        href: '/admin/products/requests',
        icon: Package,
    },
    {
        title: 'Payments',
        href: '/admin/payments',
        icon: CreditCard,
    },
    {
        title: 'Field Control',
        href: '/admin/field-controls',
        icon: ShieldCheck,
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: BarChart3,
    },
    {
        title: 'Production',
        href: '/admin/production',
        icon: Printer,
    },
];

// Taxpayer navigation items
const taxpayerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/taxpayer/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Products',
        href: '/taxpayer/products',
        icon: Package,
    },
    {
        title: 'My Orders',
        href: '/taxpayer/orders',
        icon: FileText,
    },
    {
        title: 'Payments',
        href: '/taxpayer/payments',
        icon: CreditCard,
    },
    {
        title: 'Order History',
        href: '/taxpayer/orders?view=history',
        icon: History,
    },
];

// Agent navigation items
const agentNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/agent/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Inspections',
        href: '/agent/inspections',
        icon: ClipboardCheck,
    },
    {
        title: 'New Inspection',
        href: '/agent/inspections/create',
        icon: MapPin,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
    {
        title: 'Help & Support',
        href: '/help',
        icon: HelpCircle,
    },
];

function getNavItemsForUserType(userType: string | undefined): NavItem[] {
    switch (userType) {
        case 'taxpayer':
            return taxpayerNavItems;
        case 'control_agent':
            return agentNavItems;
        case 'admin':
        case 'finance':
        default:
            return adminNavItems;
    }
}

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
    const userType = auth?.user?.user_type as string | undefined;
    const navItems = getNavItemsForUserType(userType);
    const dashboardUrl = getDashboardUrlForUserType(userType);

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
