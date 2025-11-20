import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/UseTheme.ts';

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
            aria-label="Toggle theme"
            title={isDark ? 'Mode clair' : 'Mode sombre'}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
                <Moon className="w-5 h-5 text-zinc-700" />
            )}
        </button>
    );
}