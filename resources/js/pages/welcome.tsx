import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 8000); // Notification disappears after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleDiscountClick = () => {
        if (auth.user) {
            // @ts-expect-error
            if (auth.user.role?.name === 'customer') {
                router.visit(route('customer.dashboard'));
            } else {
                setNotification(
                    'You are not logged in as a customer. Logout and register as a customer to access the discounts on our products.',
                );
            }
        } else {
            router.visit(route('register'));
        }
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-yellow-100 text-[#1b1b18] dark:bg-yellow-900">
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-24 max-w-screen-2xl items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/apple-touch-icon.png" alt="CK-OILS Logo" className="h-16 w-16" />
                            <div>
                                <span className="font-bold">CK-OILS COMPANY LTD UGANDA</span>
                                <br />
                                <span className="text-sm font-bold">P.O Box 1234, Kampala, Uganda</span>
                            </div>
                        </Link>

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
                    </div>
                </header>

                <div className="flex w-full grow flex-col items-center justify-center p-6 lg:p-8">
                    <main className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                        <div className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                            <div className="flex-1 rounded-br-lg rounded-bl-lg bg-yellow-200 p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-yellow-600 dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                                <h1 className="text-6xl font-bold tracking-tight text-black dark:text-white">
                                    Welcome to<br />CK-OILS.
                                </h1>
                                <p className="text-lg text-black dark:text-orange-100">
                                    At this site tasks are done by a click or touch and we are glad to have you here. Please login or register to get started now.
                                </p>
                            </div>
                            <div className="flex-1 rounded-lg-br rounded-lg-bl bg-pink-100 p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tr-none lg:rounded-br-lg lg:p-20 dark:bg-yellow-500 dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                                <img
                                    src="/apple-touch-icon.png"
                                    alt="Site Logo"
                                />
                            </div>
                        </div>
                    </main>
                    {notification && (
                        <div className="fixed top-20 right-5 z-50 rounded-md bg-red-500 p-4 text-white">
                            {notification}
                        </div>
                    )}
                    <div className="mt-8 w-full max-w-4xl">
                        <h2 className="mb-4 text-center text-3xl font-bold">Our Products</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="flex flex-col items-center rounded-lg bg-pink-100 p-6 shadow-lg dark:bg-pink-900">
                                <img
                                    src="/cooking oil.jpg"
                                    alt="Cooking Oil"
                                    className="mb-4 h-48 w-full rounded-md object-cover"
                                />
                                <h3 className="text-xl font-semibold">Cooking Oil</h3>
                                <p className="text-center text-gray-600 dark:text-gray-300">
                                    High-quality cooking oil, perfect for all your culinary needs.
                                </p>
                                <p className="mt-4 text-lg font-bold text-green-600">Ugx 123,400</p>
                            </div>
                            <div className="flex flex-col items-center rounded-lg bg-pink-100 p-6 shadow-lg dark:bg-pink-900">
                                <img
                                    src="/shampoo.jpg"
                                    alt="Shampoo"
                                    className="mb-4 h-48 w-full rounded-md object-cover"
                                />
                                <h3 className="text-xl font-semibold">Shampoo</h3>
                                <p className="text-center text-gray-600 dark:text-gray-300">
                                    Invigorating shampoo that leaves your hair fresh and clean.
                                </p>
                                <p className="mt-4 text-lg font-bold text-green-600">Ugx 2,453</p>
                            </div>
                            <div className="flex flex-col items-center rounded-lg bg-pink-100 p-6 shadow-lg dark:bg-pink-900">
                                <img
                                    src="/soft magarine.jpg"
                                    alt="Soft Margarine"
                                    className="mb-4 h-48 w-full rounded-md object-cover"
                                />
                                <h3 className="text-xl font-semibold">Soft Margarine</h3>
                                <p className="text-center text-gray-600 dark:text-gray-300">
                                    Smooth and creamy margarine, a perfect spread.
                                </p>
                                <p className="mt-4 text-lg font-bold text-green-600">Ugx 6,000</p>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <button
                                onClick={handleDiscountClick}
                                className={cn(
                                    buttonVariants({ size: 'lg' }),
                                    'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
                                )}
                            >
                                Get a 10% Discount - Shop Now!
                            </button>
                        </div>
                    </div>
                    
                </div>
                
            <footer className="w-full bg-zinc-200 dark:bg-zinc-800">
                <div className="mx-auto max-w-4xl p-8">
                    <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-semibold">CK-OILS COMPANY LTD UGANDA</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Your trusted partner for quality products.
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">Contact Us</h3>
                            <p className="text-gray-600 dark:text-gray-300">www.info@ckoils.com</p>
                            <p className="text-gray-600 dark:text-gray-300">039-4568-890</p>
                            </div>
                            <div className="text-center">
                            <h3 className="text-lg font-semibold">Location</h3>
                            <p className="text-gray-600 dark:text-gray-300">Namanve Industrial Area<br/>Kampala, Uganda</p>
                            <p className="text-gray-600 dark:text-gray-300">P.O Box 1234, Kampala, Uganda</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a
                                href="#"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                <Youtube className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} CK-OILS. All rights reserved.
                    </div>
                </div>
            </footer>
            </div>
        </>
    );
}
