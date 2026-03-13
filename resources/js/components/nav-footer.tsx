import { type ComponentPropsWithoutRef } from 'react';

import { Icon } from '@/components/icon';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { toUrl } from '@/lib/utils';
import { type NavItem } from '@/types';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    return (
        <SidebarGroup
            {...props}
            className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}
        >
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                size="lg"
                                className="h-11 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                            >
                                <a href={toUrl(item.href)}>
                                    {item.icon && (
                                        <Icon
                                            iconNode={item.icon}
                                            className="h-5 w-5"
                                        />
                                    )}
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
