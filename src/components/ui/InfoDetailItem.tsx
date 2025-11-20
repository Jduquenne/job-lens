import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface InfoDetailItemProps {
    icon: LucideIcon;
    label: string;
    value: ReactNode;
    href?: string;
    external?: boolean;
    className?: string;
}

export function InfoDetailItem({ icon: Icon, label, value, href, external = false, className = '' }: InfoDetailItemProps) {
    const content = href ? (<a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="text-sm text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
    >
        {value}
    </a >
    ) : (
        <p className="text-sm text-zinc-900 dark:text-white">{value}</p>
    );

    return (
        <div className={`flex items-start gap-3 ${className}`}>
            <Icon className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
            <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
                {content}
            </div>
        </div>
    );
}