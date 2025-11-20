import { MapPin, Calendar } from 'lucide-react';
import { type JobApplication, STATUS_LABELS, STATUS_COLORS } from '../../types';

interface ApplicationCardProps {
    application: JobApplication;
    onClick: (application: JobApplication) => void;
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
        });
    };

    return (
        <div
            onClick={() => onClick(application)}
            className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 shadow-sm border border-zinc-400 dark:border-zinc-700 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer"
        >
            {/* Status Badge */}
            <div className="mb-2">
                <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white ${STATUS_COLORS[application.status]
                        }`}
                >
                    {STATUS_LABELS[application.status]}
                </span>
            </div>

            {/* Company & Title */}
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 truncate">
                {application.companyName}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2 truncate">
                {application.jobTitle}
            </p>

            {/* Info */}
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{application.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{formatDate(application.applicationDate)}</span>
                </div>
            </div>
        </div>
    );
}