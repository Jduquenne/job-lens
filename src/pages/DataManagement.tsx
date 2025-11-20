import { useState, useRef } from 'react';
import { Download, Upload, Database, Trash2, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { useIndexedDB } from '../hooks/useIndexedDB';

export function DataManagement() {
    const { applications, exportData, importData, clearAllData } = useIndexedDB();
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
        try {
            await exportData();
            setMessage({
                type: 'success',
                text: `Export réussi ! ${applications.length} candidature${applications.length !== 1 ? 's' : ''} exportée${applications.length !== 1 ? 's' : ''}.`,
            });
            setTimeout(() => setMessage(null), 5000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Erreur lors de l\'export des données.',
            });
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            await importData(file);
            setMessage({
                type: 'success',
                text: 'Import réussi ! Vos données ont été restaurées.',
            });
            setTimeout(() => setMessage(null), 5000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Erreur lors de l\'import. Vérifiez que le fichier est valide.',
            });
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClearAll = async () => {
        const confirmed = window.confirm(
            '⚠️ ATTENTION : Cette action est irréversible !\n\nToutes vos candidatures seront définitivement supprimées.\n\nVoulez-vous vraiment continuer ?'
        );

        if (!confirmed) return;

        const doubleConfirm = window.confirm(
            'Êtes-vous VRAIMENT sûr ? Cette action ne peut pas être annulée.'
        );

        if (!doubleConfirm) return;

        try {
            await clearAllData();
            setMessage({
                type: 'success',
                text: 'Toutes les données ont été supprimées.',
            });
            setTimeout(() => setMessage(null), 5000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Erreur lors de la suppression des données.',
            });
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-y-auto gap-4 p-4">
            {/* Message Alert - Fixed at top */}
            {message && (
                <div
                    className={`p-3 rounded-lg flex items-center gap-3 shrink-0 ${message.type === 'success'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
                        }`}
                >
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 shrink-0" />
                    ) : (
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                    )}
                    <p className="font-medium text-sm">{message.text}</p>
                </div>
            )}

            {/* Conseils - Top full width */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 shrink-0">
                <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-400 text-sm mb-1">
                            💡 Conseils d'utilisation
                        </h4>
                        <ul className="space-y-0.5 text-s text-blue-800 dark:text-blue-300">
                            <li>• Exportez régulièrement vos données pour éviter toute perte</li>
                            <li>• Gardez vos exports dans un endroit sûr (cloud, clé USB, etc.)</li>
                            <li>• Les données sont stockées localement dans votre navigateur</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Grid 2x2 - Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
                {/* Database Info */}
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-900/20 rounded-lg">
                            <Database className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                                Base de données
                            </h3>
                            <p className="text-s text-zinc-600 dark:text-zinc-400">
                                IndexedDB - Stockage local
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-600 dark:text-zinc-400">Candidatures :</span>
                            <span className="font-semibold text-zinc-900 dark:text-white">
                                {applications.length}
                            </span>
                        </div>
                        <div className="flex justify-between text-s">
                            <span className="text-zinc-600 dark:text-zinc-400">Emplacement :</span>
                            <span className="font-mono text-zinc-900 dark:text-white">
                                JobLensDB v1
                            </span>
                        </div>
                    </div>
                </div>

                {/* Export */}
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Download className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                                Exporter
                            </h3>
                            <p className="text-s text-zinc-600 dark:text-zinc-400">
                                Sauvegarde JSON
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 flex-1">
                        Téléchargez une copie de toutes vos candidatures.
                    </p>

                    <button
                        onClick={handleExport}
                        disabled={applications.length === 0}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Exporter ({applications.length})
                    </button>
                </div>

                {/* Import */}
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <Upload className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                                Importer
                            </h3>
                            <p className="text-s text-zinc-600 dark:text-zinc-400">
                                Restaurer depuis JSON
                            </p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 mb-3">
                        <p className="text-s text-yellow-800 dark:text-yellow-400">
                            ⚠️ Remplace toutes vos données actuelles
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                        id="import-file"
                    />
                    <label htmlFor="import-file" className="flex-1 flex items-end">
                        <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium cursor-pointer text-sm">
                            <Upload className="w-4 h-4" />
                            {importing ? 'Import...' : 'Choisir fichier'}
                        </span>
                    </label>
                </div>

                {/* Clear All */}
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-red-200 dark:border-red-800 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-red-600 dark:text-red-400">
                                Tout supprimer
                            </h3>
                            <p className="text-s text-zinc-600 dark:text-zinc-400">
                                Zone dangereuse
                            </p>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 mb-3">
                        <p className="text-s text-red-800 dark:text-red-400">
                            <strong>⚠️</strong> Action irréversible
                        </p>
                    </div>

                    <button
                        onClick={handleClearAll}
                        disabled={applications.length === 0}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm mt-auto"
                    >
                        <Trash2 className="w-4 h-4" />
                        Tout supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}