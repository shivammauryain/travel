'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Car, Users, Ticket } from 'lucide-react';
import Link from 'next/link';

const itineraryItems = [
    {
        id: 1,
        title: "Hospitality Passes",
        description: "Access to exclusive lounges and gourmet catering.",
        image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800&q=80",
        icon: Ticket,
        tag: "Premium"
    },
    {
        id: 2,
        title: "Meet & Greet",
        description: "Personalized welcome and assistance upon arrival.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
        icon: Users,
        tag: "Exclusive"
    },
    {
        id: 3,
        title: "Luxury Transfers",
        description: "Chauffeur-driven vehicles for all your travel needs.",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
        icon: Car,
        tag: "Comfort"
    },
    {
        id: 4,
        title: "City Tours",
        description: "Guided tours to explore the local culture and sights.",
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
        icon: MapPin,
        tag: "Explore"
    }
];

export default function SampleItinerary() {
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
        <section ref={sectionRef} className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    >
                        <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-2 block">
                            Your Journey
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                            Sample Itinerary
                        </h2>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {itineraryItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-1">
                                {/* Image */}
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />

                                    {/* Tag */}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                        {item.tag}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <item.icon className="w-4 h-4 text-amber-500" />
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Included</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
