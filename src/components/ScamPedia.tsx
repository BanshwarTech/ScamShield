import React, { useState } from 'react';
import { BookOpen, AlertOctagon, CheckCircle2, ChevronRight, ShieldCheck, Zap, CreditCard, Smartphone, Briefcase, Monitor, Receipt, AlertTriangle, Search } from 'lucide-react';
import { scamKnowledgeBase, ScamGuide } from '../data/scamKnowledge';
import { Language } from '../types/scam';

interface ScamPediaProps {
  language: Language;
}

export const ScamPedia: React.FC<ScamPediaProps> = ({ language }) => {
  const [selectedGuide, setSelectedGuide] = useState<ScamGuide>(scamKnowledgeBase[0]);
  const [search, setSearch] = useState<string>('');

  const filteredGuides = scamKnowledgeBase.filter((g) => {
    return (
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      g.summary.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getGuideIcon = (iconName: string) => {
    switch (iconName) {
      case 'credit-card':
        return <CreditCard className="w-5 h-5 text-amber-400" />;
      case 'shield-alert':
        return <AlertOctagon className="w-5 h-5 text-rose-400" />;
      case 'smartphone':
        return <Smartphone className="w-5 h-5 text-blue-400" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'briefcase':
        return <Briefcase className="w-5 h-5 text-emerald-400" />;
      case 'monitor':
        return <Monitor className="w-5 h-5 text-purple-400" />;
      case 'receipt':
        return <Receipt className="w-5 h-5 text-orange-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Scam Pedia: Indian Cyber Fraud Encyclopedia
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Learn the anatomy of major scams active in India. Understand how scammers manipulate victims, spot subtle red flags, and master unbreakable defense rules.
        </p>

        {/* Search */}
        <div className="mt-4 relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scams (e.g. UPI, Digital Arrest, AnyDesk)..."
            className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Main Grid: Guide List + Detailed Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List Column */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredGuides.map((guide) => {
            const isSelected = selectedGuide.id === guide.id;
            return (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-950 shrink-0 mt-0.5">
                  {getGuideIcon(guide.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {guide.category}
                    </span>
                    <span className="text-[10px] text-amber-300 font-semibold truncate max-w-[130px]">
                      {guide.badge}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {language === 'hi' ? guide.titleHindi : guide.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {language === 'hi' ? guide.summaryHindi : guide.summary}
                  </p>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-emerald-400 rotate-90' : 'text-slate-600'}`} />
              </div>
            );
          })}
        </div>

        {/* Right Reader Column */}
        <div className="lg:col-span-7 bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          {selectedGuide ? (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {selectedGuide.category}
                  </span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    {selectedGuide.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {language === 'hi' ? selectedGuide.titleHindi : selectedGuide.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {language === 'hi' ? selectedGuide.summaryHindi : selectedGuide.summary}
                </p>
              </div>

              {/* Golden Rule Highlight Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-transparent border border-amber-500/40 text-amber-200">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>The Unbreakable Golden Rule</span>
                </span>
                <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  {language === 'hi' ? selectedGuide.goldenRuleHindi : selectedGuide.goldenRule}
                </p>
              </div>

              {/* Modus Operandi Steps */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  How The Scammer Operates (Modus Operandi):
                </h4>
                <div className="space-y-2">
                  {selectedGuide.modusOperandi.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
                    >
                      <span className="flex h-5 w-5 rounded-full bg-slate-800 text-orange-400 font-bold text-xs items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Immediate Red Flags:</span>
                </h4>
                <ul className="space-y-2">
                  {selectedGuide.redFlags.map((flag, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2.5"
                    >
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to do instead */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm">
                <span className="font-bold text-emerald-300 block mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Your Safe Action Plan:</span>
                </span>
                <p className="leading-relaxed">{selectedGuide.safeAction}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-12">Select a guide to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};
