import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-black text-purple-200">
            <div className="mx-auto max-w-4xl p-8">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold">CK-OILS COMPANY LTD UGANDA</h3>
                        <p>
                            Your trusted partner for quality products.
                        </p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <p>www.info@ckoils.com</p>
                        <p>039-4568-890</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Location</h3>
                        <p>
                            Namanve Industrial Area
                            <br />
                            Kampala, Uganda
                        </p>
                        <p>P.O Box 1234, Kampala, Uganda</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a
                            href="#"
                            className="hover:text-white"
                        >
                            <Facebook className="h-6 w-6" />
                        </a>
                        <a
                            href="#"
                            className="hover:text-white"
                        >
                            <Instagram className="h-6 w-6" />
                        </a>
                        <a
                            href="#"
                            className="hover:text-white"
                        >
                            <Youtube className="h-6 w-6" />
                        </a>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-purple-300">
                    &copy; {new Date().getFullYear()} CK-OILS. All rights reserved.
                </div>
            </div>
        </footer>
    );
} 