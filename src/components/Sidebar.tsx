import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  History,
  Bookmark,
  Settings,
  LogOut,
  LogIn,
} from 'lucide-react';
import { DecideMateLogo } from './DecideMateLogo';
import { useDecisions } from '../context/DecisionContext';

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { isLoggedIn, logout } = useDecisions();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'New Decision', path: '/new-decision', icon: PlusCircle },
    { name: 'History', path: '/history', icon: History },
    { name: 'Saved', path: '/saved', icon: Bookmark },
  ];

  return (
    <aside className="w-64 h-full flex flex-col justify-between p-5 bg-[#0A101D] dark:bg-[#070B14] light:bg-white border-r border-[#1F2E4D] light:border-slate-200">
      <div>
        {/* Logo */}
        <div className="pb-6 border-b border-[#1F2E4D]/60 light:border-slate-200">
          <DecideMateLogo withTagline={true} />
        </div>

        {/* Main Navigation */}
        <nav className="mt-6 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1677FF] text-white shadow-[0_0_18px_rgba(22,119,255,0.4)] font-semibold'
                      : 'text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800/60 dark:hover:bg-[#101A2D] light:hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-[#1F2E4D]/60 light:border-slate-200 flex flex-col gap-1.5">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-[#1677FF] text-white shadow-[0_0_18px_rgba(22,119,255,0.4)] font-semibold'
                : 'text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800/60 dark:hover:bg-[#101A2D] light:hover:bg-slate-100'
            }`
          }
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </NavLink>

        {isLoggedIn ? (
          <button
            type="button"
            onClick={() => {
              logout();
              if (onNavigate) onNavigate();
            }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer text-left w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        ) : (
          <NavLink
            to="/login"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-[#00D9FF] hover:bg-[#00D9FF]/10 transition-all duration-200 cursor-pointer"
          >
            <LogIn className="w-4 h-4 shrink-0" />
            <span>Login / Signup</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
};
