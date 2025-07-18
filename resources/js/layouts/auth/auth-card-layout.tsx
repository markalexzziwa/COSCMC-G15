import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
    className,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
    className?: string;
}>) {
    return (
        <div className={cn('flex w-3/5 flex-col gap-6', className)}>
            <div className="flex flex-col gap-6">
                <Card className="rounded-xl bg-white/30 backdrop-blur-md shadow-xl border border-white/40">
                    <CardHeader className="px-10 pt-8 pb-0 text-center">
                    <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                <div className="flex h-17 w-17 items-center justify-center">
                    <AppLogoIcon className="size-17 fill-current text-black dark:text-white" />
                </div>
            </Link>              <CardTitle className="text-6xl font-bold">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 py-8">{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}
