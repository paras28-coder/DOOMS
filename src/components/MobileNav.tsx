import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, History, Bookmark, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'New', path: '/new-decision', icon: PlusCircle },
    { name: 'History', path: '/history', icon: History },
    { name: 'Saved', path: '/saved', icon: Bookmark },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#070B14]/95 dark:bg-[#070B14]/95 light:bg-white/95 backdrop-blur-lg border-t border-[#1F2E4D] light:border-slate-200 z-40 px-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-all duration-150 ${
                isActive
                  ? 'text-[#00D9FF] dark:text-[#00D9FF] light:text-blue-600 scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
