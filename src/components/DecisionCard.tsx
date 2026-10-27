import React from 'react';
import { motion } from 'motion/react';
import { Bookmark, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Decision } from '../types';

interface DecisionCardProps {
  decision: Decision;
  onView: (decision: Decision) => void;
  onToggleSave: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  onView,
  onToggleSave,
  onDelete,
  compact = false,
}) => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Shopping':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Education':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Career':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Finance':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Lifestyle':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -2 }}
      className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
        compact ? 'py-3 px-4' : 'p-4'
      } bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border-[#1F2E4D] light:border-slate-200 hover:border-blue-500/50 light:hover:border-blue-400 hover:shadow-[0_4px_20px_rgba(22,119,255,0.12)]`}
    >
      {/* Left content */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0 pr-2">
        <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-[#00D9FF] shrink-0 mt-0.5">
          <CheckCircle2 className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1">
          <h4
            onClick={() => onView(decision)}
            className="text-sm font-semibold text-white dark:text-white light:text-slate-900 group-hover:text-[#00D9FF] light:group-hover:text-blue-600 transition-colors truncate cursor-pointer"
          >
            {decision.question}
          </h4>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getCategoryBadge(
                decision.category
              )}`}
            >
              {decision.category}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">
              • {decision.createdAt}
            </span>
            {decision.suitabilityScore && (
              <span className="text-[11px] font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-1.5 py-0.2 rounded border border-[#00D9FF]/25">
                Score {decision.suitabilityScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onToggleSave(decision.id)}
          title={decision.isSaved ? 'Remove from Saved' : 'Save decision'}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            decision.isSaved
              ? 'text-[#00D9FF] bg-[#00D9FF]/15'
              : 'text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${decision.isSaved ? 'fill-[#00D9FF]' : ''}`} />
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(decision.id)}
            title="Delete decision"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onView(decision)}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1677FF] hover:bg-blue-500 text-white shadow-sm transition-all cursor-pointer ml-1"
        >
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
