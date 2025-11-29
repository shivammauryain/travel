'use client';

import React, { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import { packages } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Tag } from 'lucide-react';

interface TopPackagesProps {
    onOpenLeadForm: (eventTitle?: string) => void;
}

export default function TopPackages({ onOpenLeadForm }: TopPackagesProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="packages" ref={sectionRef} className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-16 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-2 block"
                    >
                        Exclusive Experiences
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-secondary"
                    >
                        Top Packages
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100 group-hover:-translate-y-2">
                                {/* Image Container */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={pkg.image}
                                        alt={pkg.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                    {/* Location Badge */}
                                    {pkg.location && (
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-secondary shadow-sm">
                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                            {pkg.location}
                                        </div>
                                    )}

                                    {/* Price Badge */}
                                    <div className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                                        {formatPrice(pkg.price)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col grow">
                                    <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {pkg.title}
                                    </h3>

                                    <p className="text-gray-600 mb-6 text-sm leading-relaxed line-clamp-2">
                                        {pkg.description}
                                    </p>

                                    {/* Inclusions */}
                                    {pkg.inclusions && (
                                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pt-4 border-t border-gray-100">
                                            {pkg.inclusions.map((inclusion, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                                    {i === 0 && <Calendar className="w-4 h-4 text-amber-500 shrink-0" />}
                                                    {i === 1 && <Tag className="w-4 h-4 text-amber-500 shrink-0" />}
                                                    {i === 2 && <MapPin className="w-4 h-4 text-amber-500 shrink-0" />}
                                                    {i === 3 && <Clock className="w-4 h-4 text-amber-500 shrink-0" />}
                                                    <span className="truncate">{inclusion}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto">
                                        <Button
                                            onClick={() => onOpenLeadForm(pkg.title)}
                                            size="sm"
                                            variant="outline"
                                            className="w-full border-amber-600 text-amber-600 hover:bg-amber-600 hover:!text-white"
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
