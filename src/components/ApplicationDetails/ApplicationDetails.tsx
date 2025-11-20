import { X, Calendar, MapPin, Mail, ExternalLink, FileText, DollarSign, FileCheck, Clock, Code } from 'lucide-react';
import { type JobApplication, STATUS_LABELS, STATUS_COLORS, CONTRACT_TYPE_LABELS, TECH_STACK_LABELS } from '../../types';
import { InfoDetailItem } from '../ui';

interface ApplicationDetailsProps {
    application: JobApplication;
    onClose: () => void;
    onEdit: (application: JobApplication) => void;
    onDelete: (id: string) => void;
}

export function ApplicationDetails({ application, onClose, onEdit, onDelete }: ApplicationDetailsProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleDelete = () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
            onDelete(application.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-zinc-200 dark:border-zinc-700 shrink-0">
                    <div className="flex-1 pr-4">
                        <div className='flex items-center gap-3'>
                            <h2 className="flex items-center text-xl font-bold text-zinc-900 dark:text-white">
                                {application.jobTitle}
                            </h2>
                            <div className='ml-1'>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${STATUS_COLORS[application.status]
                                        }`}
                                >
                                    {STATUS_LABELS[application.status]}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                            {application.companyName}
                        </p>

                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors shrink-0"
                    >
                        <X className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InfoDetailItem
                            icon={MapPin}
                            label="Localisation"
                            value={application.location}
                            className="col-span-2 md:col-span-1"
                        />

                        <InfoDetailItem
                            icon={Calendar}
                            label="Date de candidature"
                            value={formatDate(application.applicationDate)}
                            className="col-span-2 md:col-span-1"
                        />

                        <InfoDetailItem
                            icon={Mail}
                            label="Contact"
                            value={application.contactEmail}
                            href={`mailto:${application.contactEmail}`}
                            className="col-span-2 md:col-span-1"
                        />

                        {application.jobLink && (
                            <InfoDetailItem
                                icon={ExternalLink}
                                label="Offre"
                                value="Voir l'offre"
                                href={application.jobLink}
                                external
                                className="col-span-2 md:col-span-1"
                            />
                        )}

                        {application.salary && (
                            <InfoDetailItem
                                icon={DollarSign}
                                label="Salaire"
                                value={application.salary}
                                className="col-span-2 md:col-span-1"
                            />
                        )}

                        {application.contractType && (
                            <InfoDetailItem
                                icon={FileCheck}
                                label="Type de contrat"
                                value={CONTRACT_TYPE_LABELS[application.contractType]}
                                className="col-span-2 md:col-span-1"
                            />
                        )}

                        {application.attachmentName && (
                            <InfoDetailItem
                                icon={FileText}
                                label="Pièce jointe"
                                value={application.attachmentName}
                                className="col-span-2 md:col-span-1"
                            />
                        )}

                        <InfoDetailItem
                            icon={Clock}
                            label="Dernière mise à jour"
                            value={formatDate(application.updatedAt)}
                            className="col-span-2 md:col-span-1"
                        />
                    </div>



                    {/* Tech Stack */}
                    {application.techStack && application.techStack.length > 0 && (
                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                            <div className="flex items-start gap-3">
                                <Code className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">Stack technique</p>
                                    <p className="text-sm text-zinc-900 dark:text-white">
                                        {application.techStack
                                            .map((tech) => TECH_STACK_LABELS[tech as keyof typeof TECH_STACK_LABELS] || tech)
                                            .join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {application.notes && (
                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-2">Notes personnelles</p>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                                {application.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer - Actions */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 flex gap-3 shrink-0">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        Supprimer
                    </button>
                    <button
                        onClick={() => {
                            onEdit(application);
                            onClose();
                        }}
                        className="flex-1 px-4 py-2 rounded-lg bg-zinc-500 text-white font-medium hover:bg-zinc-600 transition-colors"
                    >
                        Modifier
                    </button>
                </div>
            </div>
        </div >
    );
}