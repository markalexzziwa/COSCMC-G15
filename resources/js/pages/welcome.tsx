import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-pink-100 p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-pink-900">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-transparent bg-blue-500 px-5 py-1.5 text-sm leading-normal text-white hover:bg-blue-600"
                            >
                                MENU
                            </Link>
                        ) : (
                            <div className="space-x-2">
                                <Link
                                    href={route('login')}
                                    className={cn(
                                        buttonVariants({ variant: 'default' }),
                                        'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
                                    )}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className={cn(
                                        buttonVariants(),
                                        'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
                                    )}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-green-800 p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-green-950 dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="text-5xl font-bold tracking-tight text-white dark:text-white">
                                Welcome to CK-OILS
                            </h1>
                            <p className="text-sm text-green-200">
                                We are glad to have you here. Please log in or register to get started.
                            </p>
                        </div>
                        <div className="flex-1 rounded-tr-lg rounded-tl-lg bg-red-500 p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tr-none lg:rounded-br-lg lg:p-20 dark:bg-red-700 dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                        <img
                                src="/apple-touch-icon.png"
                                alt="Site Logo"
                            />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
