import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type JobApplication, type ApplicationStatus, STATUS_LABELS, type ContractType, type RemoteType, type Priority, type ApplicationSource, REMOTE_LABELS, PRIORITY_LABELS, SOURCE_LABELS, TECH_STACK_LABELS, type TechStack, CONTRACT_TYPE_LABELS } from '../../types';
import { Input, Select, TextArea, MultiSelect, Button } from '../ui';

interface ApplicationFormProps {
    application?: JobApplication;
    onSubmit: (data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'> | JobApplication) => Promise<void>;
    onClose: () => void;
}

export function ApplicationForm({ application, onSubmit, onClose }: ApplicationFormProps) {
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        location: '',
        contactEmail: '',
        jobLink: '',
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'to_send' as ApplicationStatus,
        notes: '',
        attachmentName: '',
        salary: '',
        contractType: 'cdi' as ContractType,
        remote: 'unknown' as RemoteType,
        techStack: [] as string[],
        priority: 'medium' as Priority,
        archived: false,
        source: 'manual' as ApplicationSource,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (application) {
            setFormData({
                companyName: application.companyName,
                jobTitle: application.jobTitle,
                location: application.location,
                contactEmail: application.contactEmail,
                jobLink: application.jobLink,
                applicationDate: application.applicationDate,
                status: application.status,
                notes: application.notes,
                attachmentName: application.attachmentName || '',
                salary: application.salary || '',
                contractType: application.contractType || 'cdi',
                remote: application.remote || 'unknown',
                techStack: application.techStack || [],
                priority: application.priority || 'medium',
                archived: application.archived || false,
                source: application.source || 'manual',
            });
        }
    }, [application]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (application) {
                await onSubmit({
                    ...application,
                    ...formData,
                });
            } else {
                await onSubmit(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTechStackToggle = (tech: string) => {
        setFormData((prev) => {
            const currentStack = prev.techStack || [];
            const isSelected = currentStack.includes(tech);

            return {
                ...prev,
                techStack: isSelected
                    ? currentStack.filter((t) => t !== tech) // Retirer
                    : [...currentStack, tech], // Ajouter
            };
        });
    };

    return (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-full overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-2 pl-4 border-b border-zinc-200 dark:border-zinc-700">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {application ? 'Modifier la candidature' : 'Nouvelle candidature'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-2">
                    <div className="grid grid-cols-8 md:grid-cols-4 gap-2">
                        {/* Job Title */}
                        <div className="col-span-4 md:col-span-2">
                            <Input
                                label="Titre du poste *"
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Développeur Full Stack"
                            />
                        </div>

                        {/* Company Name */}
                        <div className="col-span-2 md:col-span-2">
                            <Input
                                label="Nom de l'entreprise *"
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Google, Microsoft..."
                            />
                        </div>

                        {/* Location */}
                        <div className="col-span-2 md:col-span-1">
                            <Input
                                label="Localisation *"
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Paris, France"
                            />
                        </div>


                        {/* Application Date */}
                        <div className="col-span-2 md:col-span-1">
                            <Input
                                label="Date de candidature *"
                                type="date"
                                name="applicationDate"
                                value={formData.applicationDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Contract Type */}
                        <div className="col-span-2 md:col-span-1">
                            <Select
                                label="Type de contrat"
                                name="contractType"
                                value={formData.contractType}
                                onChange={handleChange}
                                required
                            >
                                {Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Contact Email */}
                        <div className="col-span-4 md:col-span-1">
                            <Input
                                label="Email de contact *"
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                required
                                placeholder="contact@entreprise.com"
                            />
                        </div>

                        {/* Job Link */}
                        <div className="col-span-4 md:col-span-2">
                            <Input
                                label="Lien de l'offre"
                                type="url"
                                name="jobLink"
                                value={formData.jobLink}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>

                        {/* Salary */}
                        <div className="col-span-2 md:col-span-1">
                            <Input
                                label="Salaire"
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="Ex: 45k-55k EUR"
                            />
                        </div>

                        {/* Remote */}
                        <div className="col-span-2 md:col-span-1">
                            <Select
                                label="Remote"
                                name="remote"
                                value={formData.remote}
                                onChange={handleChange}
                                required
                            >
                                {Object.entries(REMOTE_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Priority */}
                        <div className="col-span-2 md:col-span-1">
                            <Select
                                label="Priorité"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </Select>
                        </div>



                        {/* Attachment Name */}
                        <div className="col-span-2 md:col-span-1">
                            <Input
                                label="Nom de la pièce jointe"
                                type="text"
                                name="attachmentName"
                                value={formData.attachmentName}
                                onChange={handleChange}
                                placeholder="Ex: CV_NomPrenom.pdf"
                            />
                        </div>

                        {/* Source */}
                        <div className="col-span-2 md:col-span-1">
                            <Select
                                label="Source de l'offre"
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                                required
                            >
                                {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="col-span-2 md:col-span-1">
                            <Select
                                label="Statut *"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Techstacks */}
                        <div className="col-span-4 md:col-span-4">
                            <MultiSelect
                                label="Stack technique"
                                options={TECH_STACK_LABELS}
                                selectedValues={formData.techStack as TechStack[]}
                                onChange={handleTechStackToggle}
                            />
                        </div>

                        {/* Notes */}
                        <div className="col-span-4 md:col-span-4">
                            <TextArea
                                label="Notes personnelles"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Ajoutez vos notes ici..."
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="p-3 border-t border-gray-200 dark:border-zinc-700 flex gap-3 shrink-0">
                        <Button
                            type="button"
                            variant="secondary"
                            size='md'
                            fullWidth
                            onClick={onClose}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size='md'
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Enregistrement...' : application ? 'Mettre à jour' : 'Ajouter'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}