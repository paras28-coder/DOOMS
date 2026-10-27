import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Search,
  Sparkles,
  Bot,
  Zap,
  CheckCircle,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { DecisionCard } from '../components/DecisionCard';
import { useDecisions } from '../context/DecisionContext';
import { Category, Decision } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    decisions,
    searchDraft,
    setSearchDraft,
    setCategoryDraft,
    setCurrentDecision,
    toggleSaveDecision,
    deleteDecision,
    userProfile,
  } = useDecisions();

  const [inputVal, setInputVal] = useState(searchDraft || '');

  const handleStartDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setSearchDraft(inputVal.trim());
    navigate('/new-decision');
  };

  const handleSelectCategory = (cat: Category) => {
    setCategoryDraft(cat);
    navigate('/new-decision');
  };

  const handleViewDecision = (decision: Decision) => {
    setCurrentDecision(decision);
    navigate('/results');
  };

  const categories: { cat: Category; title: string; subtitle: string }[] = [
    { cat: 'Education', title: 'Education', subtitle: 'Study, courses, college' },
    { cat: 'Career', title: 'Career', subtitle: 'Jobs, internships, growth' },
    { cat: 'Finance', title: 'Finance', subtitle: 'Investments, savings' },
    { cat: 'Shopping', title: 'Shopping', subtitle: 'Products, gadgets, etc.' },
    { cat: 'Lifestyle', title: 'Lifestyle', subtitle: 'Travel, health, daily life' },
    { cat: 'Other', title: 'Other', subtitle: 'Custom decision' },
  ];

  const recentDecisions = decisions.slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner matching Screen 1 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101A2D] via-[#0E1B33] to-[#12284D] border border-[#1F2E4D] p-6 sm:p-8 shadow-xl"
      >
        {/* Ambient neon backglow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1677FF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#00D9FF]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Decision Co-Pilot</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Good Morning, {userProfile.name}! 👋
            </h1>
            <p className="text-slate-300 dark:text-slate-300 light:text-slate-600 text-sm sm:text-base font-normal max-w-lg">
              Better decisions, less stress. Let's weigh the trade-offs and pick the winning path.
            </p>
          </div>

          {/* Futuristic Mascot Graphic card */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-[#182B50] to-[#0A1222] border border-[#00D9FF]/40 flex items-center justify-center p-3 shadow-[0_0_30px_rgba(0,217,255,0.25)] relative group">
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00D9FF] animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00D9FF]" />
              <Bot className="w-14 h-14 text-[#00D9FF] group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(0,217,255,0.6)]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Search Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 p-5 sm:p-6 shadow-lg"
      >
        <h3 className="text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-3">
          What decision are you thinking about today?
        </h3>

        <form onSubmit={handleStartDecision} className="relative flex items-center">
          <div className="absolute left-4 text-slate-400">
            <Search className="w-5 h-5 text-[#00D9FF]" />
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. Which laptop should I buy? / Should I change my job?"
            className="w-full pl-12 pr-14 py-4 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all text-sm sm:text-base font-medium shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            aria-label="Proceed to decision form"
            className="absolute right-2.5 p-2.5 rounded-lg bg-[#1677FF] hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
          <span className="font-semibold text-[#00D9FF]">Popular prompts:</span>
          <button
            type="button"
            onClick={() => setInputVal('Which laptop should I buy?')}
            className="hover:text-white underline decoration-slate-600 cursor-pointer"
          >
            Best laptop for college
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setInputVal('Should I accept a startup job or corporate offer?')}
            className="hover:text-white underline decoration-slate-600 cursor-pointer hidden sm:inline"
          >
            Job offer dilemma
          </button>
        </div>
      </motion.div>

      {/* Popular Categories Grid matching Screen 1 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
            <span>Popular Categories</span>
          </h3>
          <span className="text-xs text-slate-400">Choose a domain to start</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.cat}
              category={c.cat}
              title={c.title}
              subtitle={c.subtitle}
              onClick={handleSelectCategory}
            />
          ))}
        </div>
      </div>

      {/* Recent Decisions Section matching Screen 1 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white dark:text-white light:text-slate-900">
            Recent Decisions
          </h3>
          <Link
            to="/history"
            className="text-xs font-semibold text-[#00D9FF] hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDecisions.length > 0 ? (
          <div className="space-y-3">
            {recentDecisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                onView={handleViewDecision}
                onToggleSave={toggleSaveDecision}
                onDelete={deleteDecision}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 rounded-2xl bg-[#101A2D] border border-dashed border-[#1F2E4D] p-6">
            <p className="text-sm text-slate-400">No decisions made yet.</p>
            <Link
              to="/new-decision"
              className="inline-block mt-3 px-4 py-2 rounded-xl bg-[#1677FF] text-white text-xs font-bold"
            >
              Start Your First Decision
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Feature highlights banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-[#101A2D]/70 dark:bg-[#101A2D]/70 light:bg-white border border-[#1F2E4D] light:border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900">
              Objective Trade-offs
            </h4>
            <p className="text-[11px] text-slate-400">
              Clear pros & cons matrix based on your constraints.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#101A2D]/70 dark:bg-[#101A2D]/70 light:bg-white border border-[#1F2E4D] light:border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900">
              Weighted Scoring
            </h4>
            <p className="text-[11px] text-slate-400">
              Calculates suitability score (0-10) with reasoning.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#101A2D]/70 dark:bg-[#101A2D]/70 light:bg-white border border-[#1F2E4D] light:border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900">
              Save & Compare
            </h4>
            <p className="text-[11px] text-slate-400">
              Revisit your decisions anytime from your local history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
