"use client";

import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, Mail, Calendar, User, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsApi, packagesApi } from '@/src/lib/api';

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [packageId, setPackageId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await packagesApi.getAll();
            if (response.success) {
                setPackages(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch packages:', error);
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const selectedPackage = packages.find(pkg => pkg._id === packageId);
            const body = { 
                name, 
                email, 
                phone, 
                message,
                numberOfTravelers: 1,
                travelDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
                ...(packageId && { packageId }),
                ...(selectedPackage?.eventId?._id && { eventId: selectedPackage.eventId._id }),
            };
            
            const result = await leadsApi.create(body);
            
            if (result.success) {
                setSubmitted(true);
                toast.success('Thanks — we will respond soon.');
                setName('');
                setEmail('');
                setPhone('');
                setPackageId('');
                setMessage('');
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                if (Array.isArray(result.data)) {
                    result.data.forEach((error: string) => toast.error(error));
                } else {
                    toast.error(result.message || 'Failed to send. Please try again.');
                }
            }
        } catch (err) {
            console.error('Contact submit error:', err);
            toast.error('Failed to send. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section id="contact" className="py-24 bg-white">
                
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    {/* Left: Promo / gallery block */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative p-6 md:p-8 "
                    >
                        <div className="mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-2 block"
                >
                    Add-ons & VIP Experiences

                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
                >
                    Contact Us
                </motion.h2>
            </div>
                        <div className="flex items-start gap-6">
                            <div className="grid grid-cols-3 grid-rows-2 gap-3 w-full md:w-2/3">
                                <div className="rounded-xl overflow-hidden row-span-2 col-span-2 relative">
                                    <Image src="https://images.unsplash.com/photo-1505839673365-e3971f8d9184?w=1200&q=80" alt="stadium-vip" width={800} height={500} className="object-cover w-full h-full" />
                                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-lg">VIP</div>
                                </div>
                                <div className="rounded-lg overflow-hidden">
                                    <Image src="https://images.unsplash.com/photo-1431578500526-4d9613015464?w=1200&q=80" alt="crowd" width={400} height={260} className="object-cover w-full h-full" />
                                </div>
                                <div className="rounded-lg overflow-hidden">
                                    <Image src="https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200&q=80" alt="vip-lounge" width={400} height={260} className="object-cover w-full h-full" />
                                </div>
                                <div className="rounded-lg overflow-hidden">
                                    <Image src="https://images.unsplash.com/photo-1431578500526-4d9613015464?w=1200&q=80" alt="private-transfer" width={400} height={260} className="object-cover w-full h-full" />
                                </div>
                            </div>
                            

                            <div className="w-full md:w-1/2">
                                <p className="text-gray-600 mb-4">Upgrade your trip with curated VIP add-ons private transfers, exclusive hospitality, and behind-the-scenes access.</p>

                                <ul className="text-sm text-gray-700 space-y-2">
                                    <li className="flex items-center gap-3">
                                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                                        Private transfers & chauffeurs
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                                        Premium hospitality & suites
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                                        Guided city tours & experiences
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 text-xs text-gray-500 flex items-center gap-3">
                            <Phone className="w-3.5 h-3.5 text-gray-500" />
                            <span>+91</span>
                            <span className="font-semibold text-gray-900">902-923-890</span>
                            <span className="text-gray-300">•</span>
                            <Mail className="w-3.5 h-3.5 text-gray-500" />
                            <a className="text-amber-600 font-medium" href="mailto:hello@sportstravel.com">hello@sportstravel.com</a>
                        </div>
                    </motion.div>

                    {/* Right: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4" aria-label="contact form">
                            {submitted && (
                                <div className="rounded-md bg-emerald-50 border border-emerald-100 p-3 text-emerald-700 flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    <div className="text-sm">Thanks — we'll get back to you within 24 hours.</div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block md:col-span-1">
                                    <span className="text-sm font-medium text-gray-700">Full name</span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        placeholder="Your name"
                                    />
                                </label>

                                <label className="block md:col-span-1">
                                    <span className="text-sm font-medium text-gray-700">Select Package</span>
                                    <select
                                        value={packageId}
                                        onChange={(e) => setPackageId(e.target.value)}
                                        className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    >
                                        <option value="">Choose a package (optional)</option>
                                        {packages.map((pkg) => (
                                            <option key={pkg._id} value={pkg._id}>
                                                {pkg.name} - ₹{pkg.basePrice?.toLocaleString('en-IN')}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block md:col-span-1">
                                    <span className="text-sm font-medium text-gray-700">Email</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        placeholder="you@example.com"
                                    />
                                </label>

                                <label className="block md:col-span-1">
                                    <span className="text-sm font-medium text-gray-700">Phone</span>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        placeholder="+91 98765 43210"
                                    />
                                </label>

                                <label className="block md:col-span-2">
                                    <span className="text-sm font-medium text-gray-700">Message</span>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={5}
                                        required
                                        className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                                        placeholder="Tell us about your travel plans or questions"
                                    />
                                </label>
                            </div>

                            <div className="pt-2 md:flex md:items-center md:gap-4">
                                <Button type="submit" variant="gradient" size="md" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
