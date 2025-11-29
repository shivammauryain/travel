'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { LeadFormData } from '@/types';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

interface LeadFormProps {
    preFilledEvent?: string;
    onSuccess: () => void;
}

export default function LeadForm({ preFilledEvent, onSuccess }: LeadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultMessage = preFilledEvent
        ? `Hello! I am interested in the "${preFilledEvent}" package. Please share availability and pricing in INR for 2 adults. Also let me know what the package includes and any VIP add-ons available.`
        : `Hello! I am interested in your sports travel packages. Please share availability and pricing in INR for 2 adults and any recommended add-ons.`;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<LeadFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            message: defaultMessage,
            eventInterest: preFilledEvent || '',
        },
    });

    useEffect(() => {
        setValue('message', defaultMessage, { shouldDirty: false, shouldTouch: false });
        setValue('eventInterest', preFilledEvent || '', { shouldDirty: false, shouldTouch: false });
    }, [preFilledEvent, setValue]);

    const onSubmit = async (data: LeadFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

                if (response.ok) {
                toast.success(result.message || 'Thank you! We\'ll be in touch soon.');
                reset();
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            } else {
                toast.error(result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <Input
                    label="Full Name"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Amit Sharma"
                    className="focus:ring-amber-400"
                />

                <div className='w-full flex items-center gap-4'>
                    <Input
                        label="Email Address"
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                        placeholder="amit.sharma@example.in"
                        className="focus:ring-amber-400"
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        {...register('phone')}
                        error={errors.phone?.message}
                        placeholder="+91 98765 43210"
                        className="focus:ring-amber-400"
                    />
                </div>

                <Input
                    label="Message"
                    textarea
                    {...register('message')}
                    error={errors.message?.message}
                    placeholder="Message"
                    className="focus:ring-amber-400 md:col-span-2"
                />

            <input type="hidden" {...register('eventInterest')} />

            <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    variant="gradient"
                >
                    {isSubmitting ? 'Submitting...' : 'Request Quote'}
                </Button>
            </div>
        </form>
    );
}
