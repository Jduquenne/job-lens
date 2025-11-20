import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    children: ReactNode;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    primary: 'bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
};

const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
};

export function Badge({ variant = 'default', size = 'md', children, className = '' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {children}
        </span>
    );
}