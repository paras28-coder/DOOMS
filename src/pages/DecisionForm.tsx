import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  AlertCircle,
  Check,
  Cpu,
  Layers,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useDecisions } from '../context/DecisionContext';
import { requestRecommendation } from '../utils/recommendationApi';
import { Category, Priority } from '../types';

export const DecisionForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchDraft,
    setSearchDraft,
    categoryDraft,
    setCategoryDraft,
    addDecision,
    userProfile,
  } = useDecisions();

  const [question, setQuestion] = useState(searchDraft || '');
  const [category, setCategory] = useState<Category>(
    categoryDraft || userProfile.defaultCategory || 'Shopping'
  );
  const [priority, setPriority] = useState<Priority>('Best Value');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'Budget Friendly',
    'High Quality',
  ]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync draft if it changes
  useEffect(() => {
    if (searchDraft) setQuestion(searchDraft);
    if (categoryDraft) setCategory(categoryDraft);
  }, [searchDraft, categoryDraft]);

  const preferenceOptions = [
    'Budget Friendly',
    'High Quality',
    'Fast Delivery',
    'Eco Friendly',
    'Beginner Friendly',
    'Reputable Brand',
    'Low Maintenance',
    'Future Proof',
  ];

  const togglePreference = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setError('Please describe your decision question before proceeding.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const decisionResult = await requestRecommendation({
        question: question.trim(),
        category,
        priority,
        preferences: selectedPreferences,
        additionalDetails: additionalDetails.trim() || undefined,
      });

      // Add to decision context & storage
      await addDecision(decisionResult);

      // Clear draft
      setSearchDraft('');
      setCategoryDraft(null);

      // Navigate to results
      navigate('/results');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong generating the recommendation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* 3-Step Progress Indicator matching Screen 2 */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-xs font-bold shadow-[0_0_12px_rgba(22,119,255,0.6)]">
            1
          </div>
          <span className="text-xs sm:text-sm font-semibold text-white dark:text-white light:text-slate-900">
            Details
          </span>
        </div>

        <div className="w-8 sm:w-16 h-0.5 bg-[#1677FF]/60" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1677FF]/30 border border-[#1677FF] text-[#00D9FF] flex items-center justify-center text-xs font-bold">
            2
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[#00D9FF] dark:text-[#00D9FF] light:text-blue-600">
            Preferences
          </span>
        </div>

        <div className="w-8 sm:w-16 h-0.5 bg-slate-700/60" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold">
            3
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            Results
          </span>
        </div>
      </div>

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 p-6 sm:p-8 shadow-2xl relative"
      >
        <div className="mb-6 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
            Create a New Decision
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
            Tell us about your situation and we'll help you find the best option.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs sm:text-sm text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Text Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="decision-question"
                className="text-xs sm:text-sm font-bold text-white dark:text-white light:text-slate-800"
              >
                What do you need help with? <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {question.length}/500
              </span>
            </div>

            <textarea
              id="decision-question"
              rows={4}
              maxLength={500}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Which laptop should I buy for college programming? Budget around ₹55,000."
              className="w-full p-4 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all text-sm leading-relaxed"
            />
          </div>

          {/* Category & Priority Dropdowns in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="decision-category"
                className="text-xs sm:text-sm font-bold text-white dark:text-white light:text-slate-800"
              >
                Category
              </label>
              <select
                id="decision-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-3 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] text-sm cursor-pointer"
              >
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Education">🎓 Education</option>
                <option value="Career">💼 Career</option>
                <option value="Finance">📈 Finance</option>
                <option value="Lifestyle">✨ Lifestyle</option>
                <option value="Other">🧭 Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="decision-priority"
                className="text-xs sm:text-sm font-bold text-white dark:text-white light:text-slate-800"
              >
                Priority
              </label>
              <select
                id="decision-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-3 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] text-sm cursor-pointer"
              >
                <option value="Best Value">Best Value (Recommended)</option>
                <option value="Highest Quality">Highest Quality</option>
                <option value="Lowest Price">Lowest Price</option>
                <option value="Speed & Ease">Speed & Ease</option>
                <option value="Long-term Impact">Long-term Impact</option>
              </select>
            </div>
          </div>

          {/* Additional Preferences pill buttons matching Screen 2 */}
          <div className="space-y-2.5">
            <label className="text-xs sm:text-sm font-bold text-white dark:text-white light:text-slate-800 flex items-center justify-between">
              <span>Additional Preferences (Optional)</span>
              <span className="text-[11px] font-normal text-slate-400">
                Select factors that matter to you
              </span>
            </label>

            <div className="flex flex-wrap gap-2">
              {preferenceOptions.map((pref) => {
                const active = selectedPreferences.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border ${
                      active
                        ? 'bg-[#1677FF]/20 text-[#00D9FF] border-[#00D9FF]/60 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
                        : 'bg-[#091120] dark:bg-[#091120] light:bg-slate-100 text-slate-300 dark:text-slate-400 light:text-slate-600 border-[#1F2E4D] light:border-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {active ? (
                      <Check className="w-3.5 h-3.5 text-[#00D9FF]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    )}
                    <span>{pref}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <label
              htmlFor="additional-details"
              className="text-xs sm:text-sm font-bold text-white dark:text-white light:text-slate-800 flex items-center gap-1.5"
            >
              <span>Additional Constraints / Notes (Optional)</span>
            </label>
            <input
              id="additional-details"
              type="text"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g. Must have backlit keyboard, preference for Intel, need by Friday"
              className="w-full p-3 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF] text-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0099FF] hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base shadow-[0_0_20px_rgba(22,119,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 text-[#00D9FF]" />
              <span>Get AI Recommendation</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </motion.div>

      {/* Loading Overlay when generating demo recommendation */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 rounded-3xl bg-[#101A2D] border border-[#00D9FF]/40 max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,217,255,0.3)] space-y-4"
          >
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#00D9FF]/20 border-t-[#00D9FF] animate-spin" />
              <Cpu className="w-8 h-8 text-[#00D9FF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Analyzing Decision...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Evaluating criteria, weighing trade-offs, and calculating suitability scores.
              </p>
            </div>
            <div className="text-[11px] text-[#00D9FF] font-medium animate-pulse">
              Running multi-factor comparison model...
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
