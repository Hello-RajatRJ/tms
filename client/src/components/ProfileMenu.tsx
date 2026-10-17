import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  User as UserIcon,
  Shield,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export const ProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const roleBadgeConfig = {
    admin: {
      label: 'Admin',
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      dotClass: 'bg-rose-500',
      description: 'Full administrative access',
    },
    manager: {
      label: 'Manager',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      dotClass: 'bg-amber-500',
      description: 'Project & team management',
    },
    member: {
      label: 'Member',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      dotClass: 'bg-blue-500',
      description: 'Contributor view-only access',
    },
  }[user.role || 'member'];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200/80 dark:border-slate-700/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        aria-expanded={isOpen}
      >
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {getInitials(user.name)}
            </div>
          )}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${roleBadgeConfig.dotClass}`}
          />
        </div>

        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 max-w-[120px]">
            {user.name}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
            {user.role}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/10 dark:shadow-black/40 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
          {/* User Details Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/30"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleBadgeConfig.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${roleBadgeConfig.dotClass}`} />
                    {roleBadgeConfig.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Status Overview */}
          <div className="px-4 py-2.5 my-1 mx-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>Privileges</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {roleBadgeConfig.description}
              </span>
            </div>
          </div>

          {/* Theme Switcher Row */}
          <div className="px-2 py-1">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
                <span>Appearance</span>
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal capitalize">
                {theme} Mode
              </span>
            </button>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

          {/* Logout Action */}
          <div className="px-2 pt-1 pb-0.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
