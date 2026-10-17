import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Folder,
  Users,
  CheckSquare2,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import ThemeToggle from './ThemeToggle';
import ProfileMenu from './ProfileMenu';

export const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Projects', path: '/projects', icon: Folder },
    { name: 'Team Members', path: '/team-members', icon: Users },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#111B21] border-r border-[#E9EDEF] dark:border-[#202C33] w-64 p-5 transition-colors duration-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E9EDEF] dark:border-[#202C33] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00A884] via-[#059669] to-[#25D366] flex items-center justify-center text-white shadow-md shadow-[#00A884]/20">
            <CheckSquare2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[#111B21] dark:text-[#E9EDEF] tracking-tight">
              TMS
            </h1>
            <p className="text-xs text-[#667781] dark:text-[#8696A0] font-medium">Task & Project Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-[#667781] hover:text-[#111B21] dark:hover:text-[#E9EDEF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#00A884] text-white shadow-xs'
                    : 'text-[#667781] dark:text-[#8696A0] hover:bg-[#F0F2F5] dark:hover:bg-[#202C33] hover:text-[#111B21] dark:hover:text-[#E9EDEF]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User Session Footer (Matches Reference Image) */}
      {user && (
        <div className="mt-auto pt-4 border-t border-[#E9EDEF] dark:border-[#202C33]">
          <div
            onClick={logout}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F0F2F5] dark:hover:bg-[#202C33] transition-colors group cursor-pointer"
            title="Click to sign out"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] text-[#667781] dark:text-[#8696A0] capitalize mt-0.5">
                  {user.role || 'Admin'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#667781] dark:text-[#8696A0] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#111B21] border-b border-[#E9EDEF] dark:border-[#202C33] sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00A884] to-[#25D366] flex items-center justify-center text-white shadow-xs">
            <CheckSquare2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-bold text-[#111B21] dark:text-[#E9EDEF]">TMS</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ProfileMenu />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#667781] dark:text-[#8696A0] rounded-xl hover:bg-[#F0F2F5] dark:hover:bg-[#202C33]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-20">
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
