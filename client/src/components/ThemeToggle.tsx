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
      className={`relative inline-flex items-center justify-center p-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00A884]/40 ${
        isDark
          ? 'bg-[#202C33] text-amber-300 hover:bg-[#2A3942] border border-[#2A3942] shadow-inner'
          : 'bg-white text-[#00A884] hover:bg-[#F0F2F5] border border-[#E9EDEF] shadow-2xs'
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
