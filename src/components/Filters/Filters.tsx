import { Search, X } from 'lucide-react';
import { CONTRACT_TYPE_LABELS, type FilterState, STATUS_LABELS } from '../../types';

interface FiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
    const handleChange = (field: keyof FilterState, value: string) => {
        onFilterChange({ ...filters, [field]: value });
    };

    const clearFilters = () => {
        onFilterChange({
            searchTerm: '',
            status: 'all',
            contractType: 'all',
            location: '',
            dateFrom: '',
        });
    };

    const hasActiveFilters =
        filters.searchTerm ||
        filters.status !== 'all' ||
        filters.contractType !== 'all' ||
        filters.location ||
        filters.dateFrom;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[100px] max-w-[250px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                    type="text"
                    value={filters.searchTerm}
                    onChange={(e) => handleChange('searchTerm', e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                />
            </div>

            {/* Status */}
            <select
                value={filters.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            >
                <option className='active:bg-zinc-900' value="all">Tous statuts</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} className='active:bg-zinc-900' value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <select
                value={filters.contractType}
                onChange={(e) => handleChange('contractType', e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            >
                <option value="all">Tout contrats</option>
                {Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            {/* Location */}
            <input
                type="text"
                value={filters.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Localisation"
                className="w-32 px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />

            {/* Date From */}
            <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleChange('dateFrom', e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />

            {/* Clear */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1"
                >
                    <X className="w-4 h-4" />
                    Réinitialiser
                </button>
            )}
        </div>
    );
}