'use client';

import React from 'react';
import Button from '../ui/Button';
import { featuredEvent } from '@/lib/data';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Sparkles, TrendingUp, Award, Hotel, Ticket, MapPin, Car } from 'lucide-react';

interface HeroProps {
    onOpenLeadForm: (eventTitle?: string) => void;
}

export default function Hero({ onOpenLeadForm }: HeroProps) {

    return (
        <section
            id="hero"
            className="relative min-h-screen mb-28 flex items-center justify-center overflow-visible"
        >
            {/* Background Image with Enhanced Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-amber-900/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating decorative elements */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-20 right-20 w-96 h-96 bg-amber-500 rounded-full blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl"
            />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-20">

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
                >
                    <span className="block mb-2">Sports Travel Packages</span>
                    <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
                        For Global Events
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
                >
                    Curated travel packages combining premium tickets, luxury accommodations,
                    and unforgettable experiences at iconic sporting venues worldwide.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                            size="lg"
                            variant="outline"
                            className="shadow-2xl bg-amber-500 text-white shadow-amber-500/50 px-8 py-4 text-lg font-bold"
                        >
                            Explore Packages
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Featured mini card*/}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="flex lg:absolute lg:-bottom-40 inset-x-0 justify-center z-30 mt-10 lg:mt-0 px-4"
            >
                <div className="relative w-full max-w-[1000px] h-auto lg:h-48 bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Image on left with gradient overlay */}
                        <div className="relative w-full lg:w-1/3 h-48 lg:h-full overflow-hidden">
                            <Image src={featuredEvent.image} alt={featuredEvent.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                            {/* Featured badge */}
                            <div className="absolute top-3 left-3 px-3 py-1 bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                                FEATURED
                            </div>
                        </div>

                        {/* Content on right */}
                        <div className="w-full lg:w-2/3 p-6 lg:p-12 flex flex-col justify-center bg-linear-to-br from-white to-gray-50">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent uppercase tracking-tight">
                                    {featuredEvent.title}
                                </h4>
                                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    TRENDING
                                </div>
                            </div>

                            {/* Package includes */}
                            <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <Hotel className="w-3.5 h-3.5 text-amber-600" />
                                    <span>4 Nights</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <Ticket className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Race Tickets</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                    <span>City Tours</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <Car className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Transport</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {featuredEvent.description}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="ml-auto">
                                    <div className="text-xs text-gray-500 font-medium">Starting from</div>
                                    <div className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                        {formatPrice(featuredEvent.price)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
