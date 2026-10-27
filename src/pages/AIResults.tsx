import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  Bookmark,
  Share2,
  PlusCircle,
  ArrowLeft,
  Check,
  X,
  Star,
  Info,
  Laptop,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { useDecisions } from '../context/DecisionContext';
import { DecisionOption } from '../types';

export const AIResults: React.FC = () => {
  const navigate = useNavigate();
  const { currentDecision, toggleSaveDecision, decisions } = useDecisions();
  const [activeTab, setActiveTab] = useState<'comparison' | 'pros-cons' | 'why'>('comparison');
  const [copied, setCopied] = useState(false);
  const [selectedOptionModal, setSelectedOptionModal] = useState<DecisionOption | null>(null);

  // If no decision selected, pick first from history or show empty state
  const decision = currentDecision || decisions[0];

  if (!decision) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 text-[#00D9FF] flex items-center justify-center mx-auto">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900">
          No Recommendation Available
        </h2>
        <p className="text-sm text-slate-400">
          You haven't generated any decisions yet. Start a new one to see results!
        </p>
        <Link
          to="/new-decision"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1677FF] text-white font-semibold text-sm shadow-[0_0_15px_rgba(22,119,255,0.4)]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Decision</span>
        </Link>
      </div>
    );
  }

  const { recommendedOption, alternatives, suitabilityScore, whyRecommended, comparison, pros, cons } = decision;
  const allOptions: DecisionOption[] = [recommendedOption, ...alternatives];

  const handleShare = () => {
    navigator.clipboard.writeText(
      `DecideMate AI Recommendation for: "${decision.question}"\nTop Choice: ${recommendedOption.title} (Score: ${suitabilityScore}/10)\nReason: ${whyRecommended}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top breadcrumbs & back link */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Preferences</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#00D9FF] font-bold">Results</span>
        </div>
      </div>

      {/* Query Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/25">
            {decision.category} • Priority: {decision.priority}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900 mt-1">
            "{decision.question}"
          </h2>
          {decision.additionalDetails && (
            <p className="text-xs text-slate-400 mt-0.5">
              Note: {decision.additionalDetails}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => toggleSaveDecision(decision.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              decision.isSaved
                ? 'bg-[#00D9FF]/15 text-[#00D9FF] border-[#00D9FF]/40 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${decision.isSaved ? 'fill-[#00D9FF]' : ''}`} />
            <span>{decision.isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700 hover:text-white transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      <div role="note" className={`rounded-xl border px-4 py-3 text-xs ${decision.recommendationSource === 'gemini' ? 'border-cyan-500/25 bg-cyan-500/5 text-cyan-100' : 'border-amber-500/25 bg-amber-500/5 text-amber-100'}`}>
        {decision.recommendationSource === 'gemini'
          ? 'Generated with Gemini. Verify time-sensitive prices and specifications before purchasing.'
          : 'Generated with the local rule-based fallback. Treat product details and scores as examples, not live research.'}
      </div>

      {/* Main Highlighted Recommendation Box matching Screen 3 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-[#101A2D] via-[#12223F] to-[#0A162B] border border-[#00D9FF]/30 p-6 sm:p-8 shadow-[0_0_35px_rgba(22,119,255,0.18)] relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#1F2E4D]">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{recommendedOption.badge || 'Best Choice'}</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {recommendedOption.title}
              </h1>
              {recommendedOption.subtitle && (
                <p className="text-sm text-slate-300 mt-0.5">
                  {recommendedOption.subtitle}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {recommendedOption.price && (
                <span className="text-lg font-black text-[#00D9FF]">
                  {recommendedOption.price}
                </span>
              )}
              {recommendedOption.rating && (
                <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>
                    {recommendedOption.rating} ({recommendedOption.reviewsCount}+ reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Glowing Circular Suitability Gauge matching Screen 3 */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#091120]/80 border border-[#1F2E4D]">
            <ScoreGauge score={suitabilityScore} />
            <span className="text-[11px] font-bold text-slate-300 mt-2 uppercase tracking-wider">
              Suitability Score
            </span>
          </div>
        </div>

        {/* Tab Navigation: Comparison | Pros & Cons | Why This? matching Screen 3 */}
        <div className="mt-6">
          <div className="flex items-center gap-2 border-b border-[#1F2E4D] pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Comparison
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pros-cons')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'pros-cons'
                  ? 'bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Pros & Cons
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('why')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'why'
                  ? 'bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Why This?
            </button>
          </div>

          {/* Tab 1: Comparison Cards (Option 1, Option 2, Option 3) */}
          {activeTab === 'comparison' && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allOptions.map((opt, idx) => {
                  const isRec = opt.isRecommended || idx === 0;
                  return (
                    <div
                      key={opt.id || idx}
                      className={`relative rounded-2xl p-5 flex flex-col justify-between border transition-all duration-200 ${
                        isRec
                          ? 'bg-[#122344] border-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.2)]'
                          : 'bg-[#091120] border-[#1F2E4D] hover:border-slate-600'
                      }`}
                    >
                      {isRec && (
                        <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-[#00D9FF] text-slate-950 text-[10px] font-black uppercase tracking-wider">
                          Best Choice
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#00D9FF]">
                          <Laptop className="w-5 h-5" />
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white">
                            {opt.title}
                          </h4>
                          {opt.price && (
                            <div className="text-sm font-black text-[#00D9FF] mt-1">
                              {opt.price}
                            </div>
                          )}
                        </div>

                        {/* Specs list */}
                        <div className="space-y-1.5 pt-2 border-t border-[#1F2E4D]/60 text-xs">
                          {opt.specs.map((spec, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-1.5 text-slate-300">
                              <Check className="w-3.5 h-3.5 text-[#00D9FF] shrink-0 mt-0.5" />
                              <span className="leading-tight">{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedOptionModal(opt)}
                        className={`mt-5 w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isRec
                            ? 'bg-[#1677FF] hover:bg-blue-500 text-white shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Side-by-side comparison table */}
              {comparison && comparison.length > 0 && (
                <div className="rounded-2xl bg-[#091120] border border-[#1F2E4D] overflow-hidden">
                  <div className="p-3.5 bg-[#0F1B30] border-b border-[#1F2E4D] font-bold text-xs uppercase tracking-wider text-slate-300">
                    Feature Comparison Matrix
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#1F2E4D] text-slate-400">
                          <th className="p-3 font-semibold">Attribute</th>
                          <th className="p-3 font-bold text-[#00D9FF]">
                            {recommendedOption.title.split(' ')[0]} (Recommended)
                          </th>
                          <th className="p-3 font-semibold">
                            {alternatives[0]?.title.split(' ')[0] || 'Alt 1'}
                          </th>
                          <th className="p-3 font-semibold">
                            {alternatives[1]?.title.split(' ')[0] || 'Alt 2'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1F2E4D]/60">
                        {comparison.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-800/30">
                            <td className="p-3 font-medium text-slate-300">{row.attribute}</td>
                            <td className="p-3 font-bold text-[#00D9FF]">{row.recommended}</td>
                            <td className="p-3 text-slate-400">{row.alt1}</td>
                            <td className="p-3 text-slate-400">{row.alt2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Pros & Cons */}
          {activeTab === 'pros-cons' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Advantages (Pros)</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  {pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  <span>Considerations & Trade-offs (Cons)</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  {cons.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Why This */}
          {activeTab === 'why' && (
            <div className="mt-6 p-6 rounded-2xl bg-[#091120] border border-[#1F2E4D] space-y-3">
              <h4 className="text-sm font-bold text-[#00D9FF] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Decision Logic & Reasoning</span>
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {whyRecommended}
              </p>
              <div className="pt-2 text-xs text-slate-400 border-t border-[#1F2E4D]">
                Evaluation based on your selected priority of <strong>{decision.priority}</strong> and constraints.
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Why We Recommend Callout Box matching Screen 3 bottom */}
      <div className="p-5 rounded-2xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 flex items-start gap-3.5 shadow-md">
        <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/30 text-[#00D9FF] flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
            Why we recommend {recommendedOption.title}?
          </h4>
          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1 leading-relaxed">
            {whyRecommended}
          </p>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => toggleSaveDecision(decision.id)}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              decision.isSaved
                ? 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${decision.isSaved ? 'fill-[#00D9FF]' : ''}`} />
            <span>{decision.isSaved ? 'Saved in Library' : 'Save Decision'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/new-decision')}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#1677FF] hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(22,119,255,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Decision</span>
          </button>
        </div>
      </div>

      {/* Option Details Modal */}
      {selectedOptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-3xl bg-[#101A2D] border border-[#1F2E4D] p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedOptionModal(null)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/30">
                {selectedOptionModal.badge || 'Alternative Option'}
              </span>
              <h3 className="text-xl font-bold text-white mt-1.5">
                {selectedOptionModal.title}
              </h3>
              <p className="text-xs text-slate-400">{selectedOptionModal.subtitle}</p>
            </div>

            {selectedOptionModal.price && (
              <div className="text-base font-extrabold text-[#00D9FF]">
                {selectedOptionModal.price}
              </div>
            )}

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Full Specifications
              </h5>
              <div className="space-y-1.5">
                {selectedOptionModal.specs.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-[#00D9FF] shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOptionModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#1677FF] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
