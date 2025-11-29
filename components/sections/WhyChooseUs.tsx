'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, Users, Star, Shield } from 'lucide-react';

const stats = [
    { label: "Happy Travelers", value: 12000, suffix: "+", icon: Users },
    { label: "Satisfaction Rate", value: 98, suffix: "%", icon: Star },
    { label: "Official Partners", value: 50, suffix: "+", icon: Shield },
    { label: "Rated Experiences", value: 4.9, suffix: "/5", icon: Trophy },
];

const steps = [
    {
        number: "01",
        title: "Choose your event",
        description: "Browse our curated selection of premium sports packages from F1 to the World Cup."
    },
    {
        number: "02",
        title: "We arrange your travel + tickets",
        description: "We handle flights, luxury accommodation, and official match tickets so you don't have to."
    },
    {
        number: "03",
        title: "Enjoy a seamless sports experience",
        description: "Arrive at the venue stress-free and immerse yourself in the action with VIP perks."
    }
];

export default function WhyChooseUs() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Stats */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            className="mb-12"
                        >
                            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-2 block">
                                Why Choose Us
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                                We make sports travel <span className="text-amber-600">unforgettable.</span>
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <stat.icon className="w-8 h-8 text-amber-500 mb-4" />
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {isVisible ? (
                                            <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                                        ) : (
                                            <span>0{stat.suffix}</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Process Steps */}
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-100 hidden md:block"></div>

                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.3 + index * 0.2 }}
                                    className="relative flex gap-6 group"
                                >
                                    {/* Number Circle */}
                                    <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-white border-2 border-amber-100 group-hover:border-amber-500 group-hover:bg-amber-500 transition-all duration-300 flex items-center justify-center shadow-sm">
                                        <span className="text-amber-600 font-bold group-hover:text-white transition-colors duration-300">
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="pt-2">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// Helper component for counting up numbers
function CountUp({ end, duration, suffix }: { end: number, duration: number, suffix: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [end, duration]);

    return (
        <span>
            {end % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}
            {suffix}
        </span>
    );
}
