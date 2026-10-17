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
      badgeClass: 'bg-[#E7F8F0] text-[#00A884] dark:bg-[#075E54]/40 dark:text-[#25D366] border-[#00A884]/30',
      dotClass: 'bg-[#00A884]',
      description: 'Contributor view-only access',
    },
  }[user.role || 'member'];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-2xl bg-white dark:bg-[#202C33] hover:bg-[#F0F2F5] dark:hover:bg-[#2A3942] border border-[#E9EDEF] dark:border-[#2A3942] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A884]/40 shadow-2xs"
        aria-expanded={isOpen}
      >
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#00A884]/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#075E54] to-[#00A884] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {getInitials(user.name)}
            </div>
          )}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#202C33] ${roleBadgeConfig.dotClass}`}
          />
        </div>

        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] line-clamp-1 max-w-[120px]">
            {user.name}
          </span>
          <span className="text-[10px] text-[#667781] dark:text-[#8696A0] capitalize font-medium">
            {user.role}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#667781] dark:text-[#8696A0] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-white dark:bg-[#202C33] border border-[#E9EDEF] dark:border-[#2A3942] modal-wa-container py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          {/* Top Emerald Line */}
          <div className="h-1 -mt-2.5 mb-2 w-full bg-gradient-to-r from-[#075E54] via-[#00A884] to-[#25D366]" />

          {/* User Details Header */}
          <div className="px-4 py-3 border-b border-[#E9EDEF] dark:border-[#2A3942]">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#00A884]/30"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#075E54] to-[#00A884] text-white font-bold text-sm flex items-center justify-center shadow-md">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#111B21] dark:text-[#E9EDEF] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[#667781] dark:text-[#8696A0] truncate">
                  {user.email}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleBadgeConfig.badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${roleBadgeConfig.dotClass}`} />
                    {roleBadgeConfig.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Status Overview */}
          <div className="px-4 py-2.5 my-1 mx-2 rounded-2xl bg-[#F0F2F5] dark:bg-[#222E35] border border-[#E9EDEF] dark:border-[#2A3942]">
            <div className="flex items-center justify-between text-xs text-[#111B21] dark:text-[#E9EDEF]">
              <span className="flex items-center gap-1.5 font-semibold">
                <Shield className="w-3.5 h-3.5 text-[#00A884]" />
                <span>Privileges</span>
              </span>
              <span className="text-[11px] font-medium text-[#667781] dark:text-[#8696A0]">
                {roleBadgeConfig.description}
              </span>
            </div>
          </div>

          {/* Theme Switcher Row */}
          <div className="px-2 py-1">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-2xl text-[#111B21] dark:text-[#E9EDEF] hover:bg-[#F0F2F5] dark:hover:bg-[#222E35] transition-colors"
            >
              <span className="flex items-center gap-2.5">
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-[#00A884]" />
                )}
                <span>Appearance</span>
              </span>
              <span className="text-[11px] text-[#667781] dark:text-[#8696A0] font-medium capitalize">
                {theme} Mode
              </span>
            </button>
          </div>

          <div className="h-px bg-[#E9EDEF] dark:bg-[#2A3942] my-1" />

          {/* Logout Action */}
          <div className="px-2 pt-1 pb-0.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors focus:outline-none"
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
