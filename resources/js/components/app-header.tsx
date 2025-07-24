import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

type NavItemWithEmoji = {
    title: string;
    href: string;
    icon?: any;
    onClick?: (e: any) => void;
    emoji?: string;
};

const mainNavItems: NavItemWithEmoji[] = [
    {
        title: 'Home',
        href: '/dashboard',
        icon: LayoutGrid,
        emoji: '🏠',
    },
    {
        title: 'Report',
        href: '/report',
        icon: Folder,
        emoji: '📄',
    },
    {
        title: 'Analytics',
        href: '/analytics',
        icon: BookOpen,
        emoji: '📊',
    },
    {
        title: 'Chat',
        href: '/chat',
        icon: Search,
        emoji: '📬',
    },
    {
        title: 'Guest Mode',
        href: '/welcome',
        onClick: () => router.post(route('logout')),
        emoji: '👤',
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="border-b border-sidebar-border/80 backdrop-blur-md bg-yellow-400/20 print:hidden" style={{ background: 'linear-gradient(90deg, rgba(71, 115, 151, 0.8) 0%, rgba(41, 46, 194, 0.7) 100%)' }}>
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    onClick={item.title === 'Guest Mode' ? (e) => { e.preventDefault(); router.post(route('logout')); } : item.onClick}
                                                    className={
                                                        `flex items-center space-x-2 font-medium bg-blue-200 hover:bg-blue-300 text-black px-6 py-3 rounded-lg text-lg transition-all duration-200 ` +
                                                        (page.url === item.href ? 'bg-blue-900 text-white px-8 py-4 text-2xl' : '')
                                                    }
                                                >
                                                    <span className="mr-2">{item.emoji}</span>
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/dashboard" prefetch className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden lg:flex flex-1 justify-center items-center space-x-4">
                        {mainNavItems.map((item) => {
                            const isActive = page.url === item.href;
                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={item.title === 'Guest Mode' ? (e) => { e.preventDefault(); router.post(route('logout')); } : item.onClick}
                                    className={`group flex items-center justify-center rounded-lg transition-all duration-200 px-6 py-3 text-lg
                                        ${isActive ? 'bg-blue-900 text-white px-8 py-4 text-2xl font-bold shadow-lg' : 'bg-blue-300 text-black hover:bg-blue-500'}
                                    `}
                                >
                                    <span className="mr-2">{item.emoji}</span>
                                    <span className="tracking-wide">{item.title}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            {/* Search icon removed */}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}