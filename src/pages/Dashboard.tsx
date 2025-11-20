import { useState, useMemo } from 'react';
import { Plus, Briefcase, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { ApplicationForm } from '../components/ApplicationForm/ApplicationForm';
import { ApplicationCard } from '../components/ApplicationCard/ApplicationCard';
import { ApplicationDetails } from '../components/ApplicationDetails/ApplicationDetails';
import { Filters } from '../components/Filters/Filters';
import type { JobApplication, FilterState } from '../types';

export function Dashboard() {
    const { applications, loading, addApplication, updateApplication, deleteApplication } =
        useIndexedDB();

    const [showForm, setShowForm] = useState(false);
    const [editingApplication, setEditingApplication] = useState<JobApplication | undefined>();
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | undefined>();
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        status: 'all',
        location: '',
        dateFrom: '',
        contractType: 'all',
    });

    // Filtered applications
    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                const matchesSearch =
                    app.companyName.toLowerCase().includes(searchLower) ||
                    app.jobTitle.toLowerCase().includes(searchLower) ||
                    app.location.toLowerCase().includes(searchLower) ||
                    app.notes.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            if (filters.status !== 'all' && app.status !== filters.status) {
                return false;
            }

            if (filters.contractType !== 'all' && app.contractType !== filters.contractType) {
                return false;
            }

            if (filters.location && !app.location.toLowerCase().includes(filters.location.toLowerCase())) {
                return false;
            }

            if (filters.dateFrom && app.applicationDate < filters.dateFrom) {
                return false;
            }

            return true;
        });
    }, [applications, filters]);

    // Statistics
    const stats = useMemo(() => {
        const total = applications.length;
        const sent = applications.filter((app) => app.status === 'sent').length;
        const interviews = applications.filter((app) => app.status === 'interview').length;
        const offers = applications.filter((app) => app.status === 'offer_received').length;

        return { total, sent, interviews, offers };
    }, [applications]);

    const handleSubmit = async (
        data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'> | JobApplication
    ) => {
        if ('id' in data) {
            await updateApplication(data as JobApplication);
        } else {
            await addApplication(data);
        }
    };

    const handleEdit = (application: JobApplication) => {
        setEditingApplication(application);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingApplication(undefined);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <>
            {/* Container principal - IMPORTANT: h-full, flex-col, overflow-hidden */}
            <div className="h-full flex flex-col overflow-hidden">

                {/* Partie FIXE - Stats + Filtres - Ne scrolle JAMAIS */}
                <div className="shrink-0 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="p-4 space-y-3">

                        {/* Stats inline avec bouton */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <Briefcase className="lg:w-8 lg:h-8 w-4 h-4 text-zinc-400" />
                                    <div>
                                        <p className="lg:text-xs text-zinc-500 dark:text-zinc-400">Total</p>
                                        <p className="text-lg font-bold text-zinc-900 dark:text-white">{stats.total}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="lg:w-8 lg:h-8 w-4 h-4 text-blue-400/70" />
                                    <div>
                                        <p className="lg:text-xs text-zinc-500 dark:text-zinc-400">Envoyées</p>
                                        <p className="text-lg font-bold text-zinc-900 dark:text-white">{stats.sent}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="lg:w-8 lg:h-8 w-4 h-4 text-purple-400/70" />
                                    <div>
                                        <p className="lg:text-xs text-zinc-500 dark:text-zinc-400">Entretiens</p>
                                        <p className="text-lg font-bold text-zinc-900 dark:text-white">{stats.interviews}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="lg:w-8 lg:h-8 w-4 h-4 text-emerald-400/70" />
                                    <div>
                                        <p className="lg:text-xs text-zinc-500 dark:text-zinc-400">Offres</p>
                                        <p className="text-lg font-bold text-zinc-900 dark:text-white">{stats.offers}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-500 text-white rounded-lg hover:bg-zinc-600 transition-colors font-medium text-sm"
                            >
                                <Plus className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Filtres */}
                        <Filters filters={filters} onFilterChange={setFilters} />
                    </div>
                </div>

                {/* Partie SCROLLABLE - Grille de candidatures - SEULE zone qui scrolle */}
                <div className="flex-1 overflow-y-auto! bg-zinc-300 dark:bg-zinc-900 custom-scrollbar">
                    <div className="p-4">
                        {filteredApplications.length === 0 ? (
                            <div className="h-full flex items-center justify-center py-20 border-2">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                                        <Briefcase className="w-8 h-8 text-zinc-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                                        Aucune candidature
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                        {applications.length === 0
                                            ? 'Commencez à ajouter vos candidatures'
                                            : 'Aucune candidature ne correspond à vos filtres'}
                                    </p>
                                    {applications.length === 0 && (
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-500 text-white rounded-lg hover:bg-zinc-600 transition-colors font-medium"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Ajouter ma première candidature
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {filteredApplications.map((app) => (
                                    <ApplicationCard
                                        key={app.id}
                                        application={app}
                                        onClick={setSelectedApplication}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showForm && (
                <ApplicationForm
                    application={editingApplication}
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                />
            )}

            {selectedApplication && (
                <ApplicationDetails
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(undefined)}
                    onEdit={handleEdit}
                    onDelete={deleteApplication}
                />
            )}
        </>
    );
}