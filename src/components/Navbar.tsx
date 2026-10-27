import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  Sparkles,
  User,
  CheckCircle2,
} from 'lucide-react';
import { DecideMateLogo } from './DecideMateLogo';
import { ThemeToggle } from './ThemeToggle';
import { Sidebar } from './Sidebar';
import { useDecisions } from '../context/DecisionContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { userProfile, isLoggedIn, decisions } = useDecisions();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/new-decision':
        return 'Decision Form';
      case '/results':
        return 'AI Results';
      case '/history':
        return 'Decision History';
      case '/saved':
        return 'Saved Decisions';
      case '/settings':
        return 'Settings & Preferences';
      case '/login':
        return 'Account Login';
      case '/signup':
        return 'Create Account';
      default:
        return 'DecideMate AI';
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'Recommendation ready',
      desc: 'ASUS Vivobook 15 recommendation is saved in your history.',
      time: '10m ago',
    },
    {
      id: 2,
      title: 'Pro tip',
      desc: 'Add specific priorities like "Budget" to refine candidate scores.',
      time: '1h ago',
    },
  ];

  return (
    <>
      <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-[#0A101D]/90 dark:bg-[#070B14]/90 light:bg-white/90 backdrop-blur-md border-b border-[#1F2E4D] light:border-slate-200 sticky top-0 z-30">
        {/* Left: Mobile hamburger & Page Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-[#101A2D] dark:bg-[#101A2D] light:bg-slate-100 border border-[#1F2E4D] light:border-slate-300 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/20">
              Workspace
            </span>
            <span className="text-slate-600 dark:text-slate-500 light:text-slate-400">/</span>
            <span className="text-sm font-bold text-white dark:text-white light:text-slate-900">
              {getPageTitle()}
            </span>
          </div>

          <div className="md:hidden">
            <DecideMateLogo size="sm" />
          </div>
        </div>

        {/* Right: Theme Toggle, Notifications, User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher */}
          <div className="hidden sm:block">
            <ThemeToggle variant="pill" />
          </div>
          <div className="sm:hidden">
            <ThemeToggle variant="icon" />
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="View notifications"
              className="relative p-2 rounded-xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-slate-100 border border-[#1F2E4D] light:border-slate-300 text-slate-300 hover:text-[#00D9FF] light:hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
            </button>

            {notificationsOpen && (
              <div
                className="absolute right-0 mt-2 w-80 p-3 rounded-2xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 shadow-2xl z-50 text-left"
                onMouseLeave={() => setNotificationsOpen(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#1F2E4D] light:border-slate-200 px-1">
                  <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider">
                    Notifications
                  </h4>
                  <span className="text-[11px] text-[#00D9FF] font-medium">
                    {decisions.length} Decisions logged
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-[#091120] dark:bg-[#070B14] light:bg-slate-50 border border-[#1F2E4D]/60 light:border-slate-200 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9FF]" />
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-slate-300 dark:text-slate-400 light:text-slate-600 mt-1 text-[11px] leading-relaxed">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile avatar pill */}
          {isLoggedIn ? (
            <Link
              to="/settings"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#101A2D] dark:bg-[#101A2D] light:bg-slate-100 border border-[#1F2E4D] light:border-slate-300 hover:border-[#00D9FF]/50 transition-all cursor-pointer group"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1677FF] to-[#00D9FF] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {userProfile.avatarText || 'P'}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#101A2D]" />
              </div>
              <span className="text-xs font-semibold text-white dark:text-white light:text-slate-800 group-hover:text-[#00D9FF] transition-colors hidden sm:inline">
                {userProfile.name}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#1677FF] text-white hover:bg-blue-500 shadow-[0_0_12px_rgba(22,119,255,0.4)] transition-all cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[80vw] h-full shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};
