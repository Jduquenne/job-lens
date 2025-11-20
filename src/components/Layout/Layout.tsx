import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, LayoutDashboard, Database } from 'lucide-react';
import { ThemeToggle } from '../ThemeToogle/ThemeToogle';
import { dbService } from '../../services/db';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/data', icon: Database, label: 'Import/Export' },
    ];

    return (
        <div className="h-screen flex dark:bg-zinc-900 overflow-hidden">
            {/* Sidebar - Fixed */}
            <aside className="w-16 lg:w-64 bg-zinc-400 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex flex-col shrink-0">
                {/* Logo - Caché sur mobile, visible sur desktop */}
                <div className="p-4 lg:p-6 border-b border-zinc-200 dark:border-zinc-700 shrink-0">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                        <div className="p-2 bg-zinc-500 rounded-lg shrink-0">
                            <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        {/* Texte visible uniquement sur desktop */}
                        <div className="hidden lg:block">
                            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                                Job Lens
                            </h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Gestionnaire de candidatures
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation - Icônes centrées sur mobile, avec texte sur desktop */}
                <nav className="flex-1 p-2 lg:p-4 space-y-2 overflow-y-auto bg-zinc-300 dark:bg-zinc-800">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={item.label}
                                className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-3 lg:px-4 rounded-lg transition-colors ${isActive
                                    ? 'bg-zinc-500 text-white'
                                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {/* Label visible uniquement sur desktop */}
                                <span className="hidden lg:inline font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer - Caché sur mobile, visible sur desktop */}
                <div className="hidden lg:block p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="space-y-2">
                        {/* Badge environnement */}
                        {dbService.isDevelopment() && (
                            <div className="mb-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded text-center">
                                <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-400">
                                    🔧 MODE DEV
                                </span>
                            </div>
                        )}
                        <div className="text-xs text-zinc-700 dark:text-gray-400 text-center">
                            v1.0.0 - Crée par <a href="https://github.com/Jduquenne" className='pointer hover:text-zinc-100' target="_blank" rel="noopener noreferrer">Jason Duquenne</a>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header - Fixed at top */}
                <header className="h-14 bg-zinc-200 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 shrink-0">
                    <div className="h-full px-4 flex items-center justify-between">
                        <div className="text-lg font-semibold text-zinc-900 dark:text-white">
                            {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
                        </div>
                        <ThemeToggle />
                    </div>
                </header>

                {/* Page Content - Scrollable area */}
                <main className="flex-1 overflow-hidden bg-zinc-100">
                    {children}
                </main>
            </div>
        </div>
    );
}