import { Facebook, Instagram, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-black text-purple-200">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 text-center md:text-left">
                    <div className="flex items-center space-x-4 text-center md:text-left">
                        <img src="/footerck.jpg" alt="CK-OILS" className="w-16 h-16 object-cover rounded-lg" />
                        <div>
                            <h3 className="text-lg font-semibold">CK-OILS COMPANY LTD UGANDA</h3>
                            <p>
                                Your trusted partner for quality products.
                            </p>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <p className="flex items-center justify-center gap-2"><Mail className="h-5 w-5" /> www.info@ckoils.com</p>
                        <p className="flex items-center justify-center gap-2"><Phone className="h-5 w-5" /> +256 39-4568-890</p>
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
        </footer>
    );
} 