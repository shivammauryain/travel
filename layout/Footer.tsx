'use client';

import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import { packages } from '@/lib/data';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { label: 'About Us', href: '#' },
        { label: 'Our Packages', href: '#packages' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Contact', href: '#contact' },
        { label: 'Privacy Policy', href: '#' },
    ];

    const socialLinks = [
        { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    ];

    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

    function handleNewsletter(e: React.FormEvent) {
        e.preventDefault();
        // TODO: wire to API
        setNewsletterSubmitted(true);
        setNewsletterEmail('');
        setTimeout(() => setNewsletterSubmitted(false), 5000);
    }

    return (
        <footer id="footer" className="bg-white text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Decorative top accent */}
                <div className="absolute inset-x-0 top-0 -translate-y-6 flex justify-center pointer-events-none">
                    <div className="w-[120px] h-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 shadow-md" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="space-y-4 md:col-span-1">
                        <div className="text-2xl font-extrabold">
                            <span className="text-amber-600">Sports</span>Travel
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Curated packages combining premium tickets, top hotels, and seamless logistics for global sporting events.
                        </p>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            <span>Noida, India</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-600">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="hover:text-amber-600 transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Packages  */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Top Packages</h4>
                        <ul className="space-y-2 text-gray-600">
                            {packages.slice(0, 5).map((pkg) => (
                                <li key={pkg.id}>
                                    <a href="#packages" className="hover:text-amber-600 transition-colors">{pkg.title}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter + Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
                        <div className="mt-6 space-y-2 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-amber-500" />
                                <a href="mailto:hello@sportstravel.com" className="hover:text-amber-600">hello@sportstravel.com</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-amber-500" />
                                <a href="tel:+91902923890" className="hover:text-amber-600">+91 902-923-890</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">&copy; {currentYear} SportsTravel. All rights reserved.</div>
                    <div className="flex items-center gap-3">
                        {socialLinks.map((s) => {
                            const Icon = s.icon;
                            return (
                                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-amber-50 transition-colors">
                                    <Icon className="w-4 h-4 text-gray-700" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}
