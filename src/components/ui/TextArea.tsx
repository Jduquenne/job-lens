import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export function TextArea({ label, error, fullWidth = true, className = '', ...props }: TextAreaProps) {
    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <textarea
                className={`px-4 py-2 rounded-lg text-s border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''
                    } ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
        </div>
    );
}