import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  Compass,
  LucideIcon,
} from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  title: string;
  subtitle: string;
  isSelected?: boolean;
  onClick: (cat: Category) => void;
}

interface CategoryMeta {
  icon: LucideIcon;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  glowColor: string;
  borderColor: string;
}

const CATEGORY_META: Record<Category, CategoryMeta> = {
  Education: {
    icon: GraduationCap,
    bgColor: 'from-blue-600/10 to-cyan-500/10',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-[#00D9FF]',
    glowColor: 'group-hover:border-[#00D9FF]/40',
    borderColor: 'border-blue-500/20',
  },
  Career: {
    icon: Briefcase,
    bgColor: 'from-purple-600/10 to-indigo-500/10',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    glowColor: 'group-hover:border-purple-500/40',
    borderColor: 'border-purple-500/20',
  },
  Finance: {
    icon: TrendingUp,
    bgColor: 'from-emerald-600/10 to-teal-500/10',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    glowColor: 'group-hover:border-emerald-500/40',
    borderColor: 'border-emerald-500/20',
  },
  Shopping: {
    icon: ShoppingBag,
    bgColor: 'from-rose-600/10 to-pink-500/10',
    iconBg: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
    glowColor: 'group-hover:border-rose-500/40',
    borderColor: 'border-rose-500/20',
  },
  Lifestyle: {
    icon: Sparkles,
    bgColor: 'from-fuchsia-600/10 to-purple-500/10',
    iconBg: 'bg-fuchsia-500/20',
    iconColor: 'text-fuchsia-400',
    glowColor: 'group-hover:border-fuchsia-500/40',
    borderColor: 'border-fuchsia-500/20',
  },
  Other: {
    icon: Compass,
    bgColor: 'from-cyan-600/10 to-blue-500/10',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
    glowColor: 'group-hover:border-cyan-500/40',
    borderColor: 'border-cyan-500/20',
  },
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  title,
  subtitle,
  isSelected = false,
  onClick,
}) => {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(category)}
      className={`group relative text-left w-full p-4 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden border ${
        isSelected
          ? 'bg-[#13223f] dark:bg-[#13223f] light:bg-blue-50 border-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.25)]'
          : 'bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border-[#1F2E4D] light:border-slate-200 hover:border-slate-600 dark:hover:border-slate-500 light:hover:border-blue-400 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Background ambient gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${meta.bgColor} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="relative z-10 flex flex-col gap-3">
        {/* Category Icon */}
        <div
          className={`w-11 h-11 rounded-xl ${meta.iconBg} flex items-center justify-center border ${meta.borderColor} group-hover:scale-110 transition-transform`}
        >
          <Icon className={`w-5 h-5 ${meta.iconColor}`} />
        </div>

        {/* Content */}
        <div>
          <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 group-hover:text-[#00D9FF] light:group-hover:text-blue-600 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>
    </motion.button>
  );
};
