import React from 'react';
import { History, Trash2, ArrowUpRight, ShieldAlert, ShieldCheck, AlertTriangle, X } from 'lucide-react';
import { AnalysisResult, Language } from '../types/scam';
import { translations } from '../data/translations';

interface HistoryDrawerProps {
  history: AnalysisResult[];
  onSelectScan: (item: AnalysisResult) => void;
  onClearHistory: () => void;
  language: Language;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onSelectScan,
  onClearHistory,
  language,
}) => {
  const t = translations[language];

  const getBadge = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.history}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Locally stored analyses on your device. We respect privacy: scan history never leaves your browser.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 rounded-xl border border-rose-500/20 transition font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearHistory}</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="font-bold text-slate-300 text-sm">No Scan History Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t.noHistory}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectScan(item)}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 cursor-pointer transition shadow-lg group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getBadge(item.risk_level)}`}>
                    {item.risk_level} RISK ({item.risk_score}/100)
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                    {item.inputType}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition">
                  {item.category}
                </h4>

                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>{new Date(item.timestamp).toLocaleString()}</span>
                <span className="flex items-center gap-1 text-orange-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
