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
    <div
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 cursor-pointer select-none transition-all py-1 px-1.5 ${className}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Sun className={`w-4 h-4 transition-colors ${!isDark ? 'text-slate-400' : 'text-[#8696A0]'}`} />

      <div className="w-9 h-5 rounded-full p-0.5 bg-[#00A884] flex items-center transition-colors">
        <div
          className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-out ${
            isDark ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>

      <Moon className={`w-4 h-4 transition-colors ${isDark ? 'text-amber-300' : 'text-slate-400'}`} />
    </div>
  );
};

export default ThemeToggle;
