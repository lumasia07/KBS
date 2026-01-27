import { usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';

function getPortalName(userType: string | undefined): string {
    switch (userType) {
        case 'taxpayer':
            return 'Taxpayer Portal';
        case 'control_agent':
            return 'Agent Portal';
        case 'admin':
        case 'finance':
        default:
            return 'Admin Portal';
    }
}

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<SharedData>().props;
    const userType = auth?.user?.user_type as string | undefined;
    const portalName = getPortalName(userType);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 bg-[#003366] text-white">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-white hover:bg-white/10 hover:text-white" />
                <div className="flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5" />
                    <span className="font-semibold">{portalName}</span>
                </div>
            </div>
        </header>
    );
}
