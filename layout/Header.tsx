'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Trophy } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface NavbarProps {
    onOpenLeadForm: () => void;
}

export default function Navbar({ onOpenLeadForm }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track active section based on scroll position
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px', // Trigger when section is 20% from top
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all sections
        const sections = ['hero', 'packages', 'how-it-works', 'contact'];
        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            sections.forEach((sectionId) => {
                const element = document.getElementById(sectionId);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
            setActiveLink(id);
        }
    };

    const navLinks = [
        { label: 'Home', id: 'hero' },
        { label: 'Packages', id: 'packages' },
        { label: 'How It Works', id: 'how-it-works' },
        { label: 'Contact', id: 'contact' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'py-2 px-4 md:px-8 lg:px-16'
                : 'py-4'
                }`}
        >
            <div
                className={`max-w-7xl mx-auto transition-all duration-500 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl'
                    : 'bg-transparent'
                    }`}
            >
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <motion.div
                            className="shrink-0 flex items-center gap-3 cursor-pointer group"
                            onClick={() => scrollToSection('hero')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={`relative px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${isScrolled
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                : 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                                }`}>
                                <Trophy className="inline-block w-4 h-4 mr-1 -mt-0.5" />
                                SPORTS
                            </div>
                            <div>
                                <h1 className={`text-2xl font-bold transition-all duration-300 ${isScrolled
                                    ? 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
                                    : 'text-white drop-shadow-lg'
                                    }`}>
                                    Travel
                                </h1>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg group ${isScrolled
                                        ? 'text-gray-700 hover:text-amber-600'
                                        : 'text-white hover:text-amber-300'
                                        } ${activeLink === link.id ? 'font-semibold' : ''}`}
                                >
                                    {link.label}
                                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ${activeLink === link.id
                                        ? 'w-full bg-gradient-to-r from-amber-500 to-orange-500'
                                        : 'w-0 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full'
                                        }`} />
                                </button>
                            ))}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href="/login" className={`px-6 py-4 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:from-amber-600 hover:to-orange-600`}>
                                    Login
                                </Link>
                            </motion.div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <motion.button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`p-2 rounded-lg transition-all duration-300 ${isScrolled
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                                aria-label="Toggle menu"
                                whileTap={{ scale: 0.9 }}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className={`px-4 pb-6 space-y-2 border-t ${isScrolled ? 'border-gray-100 bg-white/50 backdrop-blur-xl' : 'border-white/10 bg-white/5 backdrop-blur-xl'
                                }`}>
                                {navLinks.map((link, index) => (
                                    <motion.button
                                        key={link.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => scrollToSection(link.id)}
                                        className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isScrolled
                                            ? 'text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-600'
                                            : 'text-white hover:bg-white/10'
                                            } ${activeLink === link.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : ''}`}
                                    >
                                        {link.label}
                                    </motion.button>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: navLinks.length * 0.1 }}
                                    className="pt-2"
                                >
                                    <Button onClick={() => onOpenLeadForm()} className="w-full" variant="gradient">
                                        Get Started
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
