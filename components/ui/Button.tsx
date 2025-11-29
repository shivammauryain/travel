import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: ButtonProps) {
    const baseStyles = "font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

    const variantStyles = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl",
        secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-lg hover:shadow-xl",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
        gradient: "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg hover:shadow-2xl hover:scale-105",
    };

    const sizeStyles = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-3 text-lg",
    };

    return (
        <button
            className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}
