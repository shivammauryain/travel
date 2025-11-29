import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    error?: string;
    textarea?: boolean;
}

export default function Input({ label, error, textarea = false, className, ...props }: InputProps) {
    const baseStyles = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300";
    const errorStyles = error ? "border-red-500" : "border-gray-300";

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            {textarea ? (
                <textarea
                    className={cn(baseStyles, errorStyles, className)}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
            ) : (
                <input
                    className={cn(baseStyles, errorStyles, className)}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                />
            )}
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
