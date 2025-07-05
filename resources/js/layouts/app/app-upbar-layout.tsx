import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppHeader } from '@/components/app-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import Footer from '@/components/footer';

export default function AppUpbarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent variant="header" className="overflow-x-hidden">
                <div className="flex-grow">
                    {children}
                </div>
                <Footer />
            </AppContent>
        </AppShell>
    );
}
