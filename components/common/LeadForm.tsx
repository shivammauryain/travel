'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { leadsApi } from '@/src/lib/api';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    numberOfTravelers: z.coerce.number().min(1, 'Number of travelers must be at least 1'),
    travelDate: z.string().refine((date) => new Date(date) > new Date(), {
        message: 'Travel date must be in the future',
    }),
    eventInterest: z.string().optional(),
    message: z.string().min(5, 'Message must be at least 5 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface LeadFormProps {
    preFilledEvent?: string;
    packageId?: string;
    eventId?: string;
    onSuccess: () => void;
}

export default function LeadForm({ preFilledEvent, packageId, eventId, onSuccess }: LeadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultMessage = preFilledEvent
        ? `I'm interested in the ${preFilledEvent} package.`
        : `I'm interested in your sports travel packages.`;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            numberOfTravelers: 2,
            travelDate: '',
            message: defaultMessage,
            eventInterest: preFilledEvent || '',
        },
    });

    useEffect(() => {
        setValue('message', defaultMessage, { shouldDirty: false, shouldTouch: false });
        setValue('eventInterest', preFilledEvent || '', { shouldDirty: false, shouldTouch: false });
    }, [preFilledEvent, defaultMessage, setValue]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);

        try {
            const leadData = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                numberOfTravelers: data.numberOfTravelers,
                travelDate: data.travelDate,
                message: data.message,
                ...(packageId && { packageId }),
                ...(eventId && { eventId }),
            };

            const result = await leadsApi.create(leadData);

            if (result.success) {
                toast.success('Thank you! We\'ll be in touch soon.');
                reset();
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            } else {
                // Handle validation errors array
                if (Array.isArray(result.data)) {
                    result.data.forEach((error: string) => toast.error(error));
                } else {
                    toast.error(result.message || 'Something went wrong. Please try again.');
                }
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

                <div className='w-full flex items-center gap-4'>
                    <Input
                        label="Number of Travelers"
                        type="number"
                        {...register('numberOfTravelers')}
                        error={errors.numberOfTravelers?.message}
                        placeholder="2"
                        className="focus:ring-amber-400"
                    />

                    <Input
                        label="Travel Date"
                        type="date"
                        {...register('travelDate')}
                        error={errors.travelDate?.message}
                        className="focus:ring-amber-400"
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
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
