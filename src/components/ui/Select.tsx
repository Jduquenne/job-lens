import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    children: ReactNode;
}

export function Select({ label, error, fullWidth = true, className = '', children, ...props }: SelectProps) {
    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <select
                className={`px-4 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''
                    } ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                {...props}
            >
                {children}
            </select>
            {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
        </div>
    );
}