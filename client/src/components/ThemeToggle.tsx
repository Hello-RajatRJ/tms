import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        isDark
          ? 'bg-slate-800/80 text-amber-400 hover:bg-slate-800 hover:text-amber-300 border border-slate-700/60 shadow-inner'
          : 'bg-white text-indigo-600 hover:bg-slate-100 hover:text-indigo-700 border border-slate-200 shadow-sm'
      } ${className}`}
      title={`Toggle theme (currently ${theme})`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-90 animate-in fade-in zoom-in-75" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12 animate-in fade-in zoom-in-75" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
