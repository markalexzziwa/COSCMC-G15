import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    return (
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
                        <p className="text-gray-600 dark:text-gray-300">
                            Namanve Industrial Area
                            <br />
                            Kampala, Uganda
                        </p>
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
    );
} 