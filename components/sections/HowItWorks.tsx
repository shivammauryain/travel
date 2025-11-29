'use client';

import React from 'react';
import { howItWorksSteps } from '@/lib/data';
import { Calendar, Settings, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
    calendar: Calendar,
    settings: Settings,
    plane: Plane,
} as const;

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-amber-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-orange-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-2 block"
                    >
                        Your Journey to Sports Glory

                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase"
                    >
                    How It Works
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Desktop Timeline Line */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-amber-500/30 via-orange-500/20 to-red-500/30 transform -translate-x-1/2 pointer-events-none"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        {howItWorksSteps.map((step, index) => {
                            const Icon = iconMap[step.icon as keyof typeof iconMap];

                            return (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    className="relative flex flex-col items-center md:items-start"
                                >
                                    

                                    {/* Step Card */}
                                    <div className="w-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 relative z-10">
                                        {/* Number Badge */}
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 md:left-8 md:transform-none">
                                            <div className="w-12 h-12 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                                                {step.number}
                                            </div>
                                        </div>

                                        {/* Icon */}
                                        <div className="flex justify-center md:justify-start mb-6 mt-4">
                                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center">
                                                <Icon className="w-10 h-10 text-amber-600" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="text-center md:text-left">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mobile Connector */}
                                    {index < howItWorksSteps.length - 1 && (
                                        <div className="md:hidden flex justify-center my-8">
                                            <div className="w-0.5 h-12 bg-linear-to-b from-amber-500/40 to-transparent"></div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
