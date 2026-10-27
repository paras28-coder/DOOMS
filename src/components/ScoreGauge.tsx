import React from 'react';
import { motion } from 'motion/react';

interface ScoreGaugeProps {
  score: number; // e.g. 8.8
  maxScore?: number;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, maxScore = 10, size = 110 }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max(score / maxScore, 0), 1);
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer ambient glow */}
      <div className="absolute inset-2 bg-[#00D9FF]/15 rounded-full blur-md" />

      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800 dark:text-[#182844] light:text-slate-200"
          fill="transparent"
        />

        {/* Animated score stroke */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
          className="drop-shadow-[0_0_8px_rgba(0,217,255,0.7)]"
        />

        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1677FF" />
            <stop offset="100%" stopColor="#00D9FF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center text score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black tracking-tight text-white dark:text-white light:text-slate-900 leading-none">
          {score.toFixed(1)}
        </span>
        <span className="text-[11px] font-semibold text-[#00D9FF] dark:text-[#00D9FF] light:text-blue-600 mt-0.5">
          /{maxScore}
        </span>
      </div>
    </div>
  );
};
