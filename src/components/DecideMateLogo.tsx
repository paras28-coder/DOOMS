import React from 'react';
import { Link } from 'react-router-dom';

interface DecideMateLogoProps {
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
}

export const DecideMateLogo: React.FC<DecideMateLogoProps> = ({ size = 'md', withTagline = false }) => {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <Link to="/" className="flex items-center gap-2.5 group select-none">
      <div className={`relative ${iconSize} flex items-center justify-center`}>
        {/* Glowing 4-point star SVG */}
        <div className="absolute inset-0 bg-[#00D9FF]/20 rounded-full blur-md group-hover:bg-[#00D9FF]/40 transition-all duration-300" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]"
        >
          <path
            d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
            fill="url(#logo_grad)"
          />
          <defs>
            <linearGradient id="logo_grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00D9FF" />
              <stop offset="0.5" stopColor="#1677FF" />
              <stop offset="1" stopColor="#00E5FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-white dark:text-white light:text-slate-900 ${textSize}`}>
            DecideMate
          </span>
          <span className="font-extrabold text-[#00D9FF] text-xs uppercase tracking-wider bg-[#00D9FF]/10 border border-[#00D9FF]/30 px-1.5 py-0.5 rounded-md shadow-[0_0_10px_rgba(0,217,255,0.2)]">
            AI
          </span>
        </div>
        {withTagline && (
          <p className="text-[11px] text-slate-400 mt-1 font-medium tracking-wide">
            Smarter Decisions. A Brighter Future.
          </p>
        )}
      </div>
    </Link>
  );
};
