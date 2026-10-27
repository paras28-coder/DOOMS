import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'pill' | 'icon';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'pill' }) => {
  const { theme, toggleTheme, setTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="p-2 rounded-xl bg-slate-800/80 dark:bg-[#101A2D] light:bg-slate-200 border border-slate-700/60 dark:border-[#1F2E4D] light:border-slate-300 text-slate-300 hover:text-white dark:hover:text-[#00D9FF] light:hover:text-blue-600 transition-all cursor-pointer shadow-sm"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
      </button>
    );
  }

  return (
    <div className="flex items-center bg-[#0d1527] dark:bg-[#0B1323] light:bg-slate-200 border border-[#1F2E4D] light:border-slate-300 rounded-full p-1 text-xs font-medium">
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-[#1677FF] text-white shadow-[0_0_12px_rgba(22,119,255,0.5)] font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Dark Mode</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-white text-slate-900 shadow-sm font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sun className="w-3.5 h-3.5 text-amber-500" />
        <span>Light Mode</span>
      </button>
    </div>
  );
};
