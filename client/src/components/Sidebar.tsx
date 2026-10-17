import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users2,
  CheckSquare2,
  Server,
  Menu,
  X,
  LogOut,
  Shield,
  Briefcase,
  User as UserIcon,
} from 'lucide-react';
import { checkHealth } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import ThemeToggle from './ThemeToggle';
import ProfileMenu from './ProfileMenu';

export const Sidebar: React.FC = () => {
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const pingServer = async () => {
      try {
        await checkHealth();
        setServerOnline(true);
      } catch {
        setServerOnline(false);
      }
    };
    pingServer();
    const interval = setInterval(pingServer, 20000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Team Members', path: '/team-members', icon: Users2 },
  ];

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: Shield,
          color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        };
      case 'manager':
        return {
          label: 'Manager',
          icon: Briefcase,
          color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        };
      case 'member':
      default:
        return {
          label: 'Member',
          icon: UserIcon,
          color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        };
    }
  };

  const roleInfo = getRoleBadge(user?.role);
  const RoleIcon = roleInfo.icon;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 p-5 transition-colors duration-200">
      {/* Brand */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <CheckSquare2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              TMS <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold tracking-wider">TS</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Task & Project Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle className="lg:hidden" />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-1">
        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Dark / Light Theme Toggle Box */}
      <div className="py-2">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Theme</span>
          <ThemeToggle />
        </div>
      </div>

      {/* User Session & Role Card with Logout */}
      {user && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${roleInfo.color}`}>
                    <RoleIcon className="w-2.5 h-2.5" />
                    {roleInfo.label}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Backend Server Status Card */}
      <div className="pt-2">
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px]">Backend API</span>
          </div>
          <span
            className={`w-2 h-2 rounded-full ${
              serverOnline === true
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse'
                : 'bg-rose-500'
            }`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <CheckSquare2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">TMS</span>
        </div>
        <div className="flex items-center gap-2">
          <ProfileMenu />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 animate-fade-in">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
