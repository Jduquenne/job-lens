interface MultiSelectProps<T extends string> {
    label?: string;
    options: Record<T, string>;
    selectedValues: T[];
    onChange: (value: T) => void;
    error?: string;
}

export function MultiSelect<T extends string>({
    label,
    options,
    selectedValues,
    onChange,
    error,
}: MultiSelectProps<T>) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    {label}
                </label>
            )}
            <div className={`flex flex-wrap gap-2 p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700/50 ${error ? 'border-red-500' : ''
                }`}>
                {(Object.keys(options) as T[]).map((key) => {
                    const isSelected = selectedValues.includes(key);

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onChange(key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isSelected
                                ? 'bg-zinc-200 text-zinc-500 shadow-sm'
                                : 'bg-zinc-50 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 hover:border-primary-500 dark:hover:border-primary-500'
                                }`}
                        >
                            {options[key]}
                        </button>
                    );
                })}
            </div>
            {selectedValues.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {selectedValues.length} sélectionné{selectedValues.length > 1 ? 's' : ''}
                </p>
            )}
            {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
        </div>
    );
}