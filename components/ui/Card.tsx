import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-xl shadow-lg overflow-hidden",
                hover && "transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                className
            )}
        >
            {children}
        </div>
    );
}
