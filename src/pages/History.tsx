import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Bookmark,
  History as HistoryIcon,
  Filter,
  PlusCircle,
  FileQuestion,
  Trash2,
} from 'lucide-react';
import { DecisionCard } from '../components/DecisionCard';
import { useDecisions } from '../context/DecisionContext';
import { Category, Decision } from '../types';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { decisions, setCurrentDecision, toggleSaveDecision, deleteDecision } = useDecisions();

  // Initialize tab based on URL path (/saved vs /history)
  const isSavedPath = location.pathname === '/saved';
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>(
    isSavedPath ? 'saved' : 'history'
  );

  useEffect(() => {
    setActiveTab(location.pathname === '/saved' ? 'saved' : 'history');
  }, [location.pathname]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filterCategories = [
    'All',
    'Shopping',
    'Education',
    'Career',
    'Finance',
    'Lifestyle',
    'Other',
  ];

  // Filter decisions according to tab, search query, and category
  const filteredDecisions = decisions.filter((d) => {
    if (activeTab === 'saved' && !d.isSaved) return false;

    if (selectedCategory !== 'All' && d.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuestion = d.question.toLowerCase().includes(q);
      const matchCategory = d.category.toLowerCase().includes(q);
      const matchRec = d.recommendedOption.title.toLowerCase().includes(q);
      return matchQuestion || matchCategory || matchRec;
    }

    return true;
  });

  const handleView = (decision: Decision) => {
    setCurrentDecision(decision);
    navigate('/results');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header & Tabs matching Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-[#0d1527] dark:bg-[#0B1323] light:bg-slate-200 border border-[#1F2E4D] light:border-slate-300 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('history');
                  navigate('/history', { replace: true });
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#1677FF] text-white shadow-[0_0_12px_rgba(22,119,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HistoryIcon className="w-3.5 h-3.5" />
                <span>History</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('saved');
                  navigate('/saved', { replace: true });
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'saved'
                    ? 'bg-[#1677FF] text-white shadow-[0_0_12px_rgba(22,119,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved ({decisions.filter((d) => d.isSaved).length})</span>
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white dark:text-white light:text-slate-900 mt-2">
            {activeTab === 'saved' ? 'Saved Decisions' : 'Decision History'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {activeTab === 'saved'
              ? 'Your bookmarked solutions for quick reference and execution.'
              : 'View and revisit your past decisions and AI recommendations.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/new-decision')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1677FF] hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(22,119,255,0.3)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Decision</span>
        </button>
      </div>

      {/* Search & Category Filter bar */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your decisions by keyword, category, or recommendation..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all"
          />
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filterCategories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border ${
                  active
                    ? 'bg-[#1677FF] text-white border-blue-400 font-bold shadow-sm'
                    : 'bg-[#101A2D] dark:bg-[#101A2D] light:bg-white text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 border-[#1F2E4D] light:border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Decision Cards List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredDecisions.length > 0 ? (
            filteredDecisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                onView={handleView}
                onToggleSave={toggleSaveDecision}
                onDelete={deleteDecision}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 px-4 rounded-3xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-dashed border-[#1F2E4D] light:border-slate-200 space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-[#00D9FF] flex items-center justify-center mx-auto">
                <FileQuestion className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                {searchQuery
                  ? 'No matching decisions found'
                  : activeTab === 'saved'
                  ? 'No saved decisions yet'
                  : 'No decisions in history'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try searching with different terms or reset your category filter.'
                  : activeTab === 'saved'
                  ? 'Bookmark decisions by clicking the bookmark icon on any recommendation card.'
                  : 'Start your first decision to build your smart record history.'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer mt-2"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
