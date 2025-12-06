'use client';

import { useEffect, useRef, useState } from 'react';
import { packagesApi } from '@/src/lib/api';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Tag, Users, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface TopPackagesProps {
    onOpenLeadForm: (eventTitle?: string, packageId?: string, eventId?: string) => void;
}

export default function TopPackages({ onOpenLeadForm }: TopPackagesProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const response = await packagesApi.getAll();
            if (response.success) {
                // Get top 6 packages sorted by tier (Premium first)
                const tierOrder = { 'Premium': 1, 'Standard': 2, 'Basic': 3, 'Economy': 4 };
                const sortedPackages = response.data
                    .sort((a: any, b: any) => {
                        const tierA = tierOrder[a.tier as keyof typeof tierOrder] || 5;
                        const tierB = tierOrder[b.tier as keyof typeof tierOrder] || 5;
                        return tierA - tierB;
                    })
                    .slice(0, 6);
                setPackages(sortedPackages);
            }
        } catch (error) {
            console.error('Failed to fetch packages:', error);
            toast.error('Failed to load packages');
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = (pkg: any) => {
        const eventTitle = pkg.eventId?.name || pkg.name;
        const eventId = pkg.eventId?._id;
        onOpenLeadForm(eventTitle, pkg._id, eventId);
    };

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
                    {loading ? (
                        // Loading skeleton
                        Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="h-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
                                <div className="h-64 bg-gray-200"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-10 bg-gray-200 rounded mt-6"></div>
                                </div>
                            </div>
                        ))
                    ) : packages.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">No packages available at the moment.</p>
                        </div>
                    ) : (
                        packages.map((pkg, index) => (
                            <motion.div
                                key={pkg._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100 group-hover:-translate-y-2">
                                    {/* Image Container */}
                                    <div className="relative h-64 w-full overflow-hidden bg-linear-to-br from-amber-200 to-gray-50">
                                        {pkg.eventId?.imageUrl ? (
                                            <Image
                                                src={pkg.eventId.imageUrl}
                                                alt={pkg.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Calendar className="w-16 h-16 text-primary/40 mx-auto mb-2" />
                                                    <p className="text-sm font-semibold text-gray-600">{pkg.eventId?.name || 'Sports Event'}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                        {/* Tier Badge */}
                                        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg ${
                                            pkg.tier === 'Premium' ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-white' :
                                            pkg.tier === 'Standard' ? 'bg-blue-500 text-white' :
                                            pkg.tier === 'Basic' ? 'bg-green-500 text-white' :
                                            'bg-gray-500 text-white'
                                        }`}>
                                            <Star className="w-3.5 h-3.5" />
                                            {pkg.tier}
                                        </div>

                                        {/* Price Badge */}
                                        <div className='absolute bottom-4 flex items-center justify-between w-full'>
                                            <p className="text-xs px-4 text-gray-800 flex items-center gap-1 mt-1">
                                                <MapPin className="w-3 h-3" />
                                                {pkg.eventId.location}
                                            </p>
                                            <div className=" text-amber-500 px-4 font-bold">
                                                ₹{pkg.basePrice?.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col grow">
                                        <div className="mb-2">
                                            <h3 className="text-xl font-bold text-secondary mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                                {pkg.name}
                                            </h3>
                                            
                                        </div>

                                        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                                            {pkg.description || 'Experience the ultimate sports travel package with premium amenities and exclusive access.'}
                                        </p>

                                        {/* Package Details */}
                                        {pkg.eventId?.startDate && pkg.eventId?.endDate && (
                                            <div className="mb-4 pb-4 border-b border-gray-100">
                                                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                                                    <span>
                                                        {new Date(pkg.eventId.startDate).toLocaleDateString('en-IN', { 
                                                            day: 'numeric', 
                                                            month: 'short', 
                                                            year: 'numeric' 
                                                        })}
                                                        {' - '}
                                                        {new Date(pkg.eventId.endDate).toLocaleDateString('en-IN', { 
                                                            day: 'numeric', 
                                                            month: 'short', 
                                                            year: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {pkg.maxTravelers && (
                                            <div className="flex items-center gap-2 text-xs text-gray-600 font-medium mb-4">
                                                <Users className="w-4 h-4 text-amber-500 shrink-0" />
                                                <span>Max {pkg.maxTravelers} Travelers</span>
                                            </div>
                                        )}

                                        {/* Inclusions */}
                                        {pkg.features && pkg.features.length > 0 && (
                                            <div className="mb-6 pt-4 border-t border-gray-100">
                                                <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                                                <ul className="space-y-1">
                                                    {pkg.features.slice(0, 3).map((feature: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                                            <Tag className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                                                            <span className="line-clamp-1">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="mt-auto">
                                            <button
                                                onClick={() => handleBookNow(pkg)}
                                                className='bg-amber-500 w-full py-2 rounded-2xl text-white font-semibold hover:bg-amber-600 shadow-lg shadow-amber-500/30 transition-colors'
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
