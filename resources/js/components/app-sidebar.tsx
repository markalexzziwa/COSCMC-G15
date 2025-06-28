import { FarmerNav } from '@/components/farmer-nav';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const dashboardNavItems: NavItem[] = [
    {
        title: 'Admin',
        href: '/admin-dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Customer',
        href: '/customer-dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Distributor',
        href: '/distributor-dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Editor',
        href: '/editor-dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Factory Store',
        href: '/factory-store-dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Inventory Manager',
        href: '/inventory-manager-dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Manufacturer',
        href: '/manufacturer-dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Retail',
        href: '/retail-dashboard',
        icon: LayoutGrid,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: User } }>().props;

    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-black">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {auth.user.role === 'farmer' ? <FarmerNav /> : <NavMain items={mainNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
