import React from 'react';
import { Shield, PhoneCall, Globe, Flame, BookOpen, HelpCircle, History, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Language } from '../types/scam';
import { translations } from '../data/translations';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  historyCount: number;
  openHelplines: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  historyCount,
  openHelplines,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top micro emergency strip */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 px-4 py-1.5 text-xs text-white font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="font-semibold tracking-wide uppercase text-[11px] bg-black/30 px-2 py-0.5 rounded">Emergency</span>
            <span className="truncate">{t.goldenHourAlert}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-2">
            <a
              href="tel:1930"
              className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-200 transition"
              title="National Cyber Crime Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              <span>Dial 1930</span>
            </a>
            <button
              onClick={openHelplines}
              className="hidden sm:inline-flex text-[11px] underline text-white/90 hover:text-white"
            >
              All Helplines
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setCurrentTab('scanner')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-400 group-hover:text-amber-300 transition-colors" />
            </div>
            {/* Small tri-color dot badge */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 border border-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-orange-200 bg-clip-text text-transparent">
                ScamShield
              </span>
              <span className="text-[10px] font-bold tracking-widest text-orange-400 border border-orange-500/30 bg-orange-500/10 px-1.5 py-0.5 rounded">
                INDIA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Center Nav tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-medium text-slate-300">
          <button
            onClick={() => setCurrentTab('scanner')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === 'scanner'
                ? 'bg-orange-500 text-white shadow font-semibold'
                : 'hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Scanner</span>
          </button>

          <button
            onClick={() => setCurrentTab('radar')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === 'radar'
                ? 'bg-orange-500 text-white shadow font-semibold'
                : 'hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Threat Radar</span>
          </button>

          <button
            onClick={() => setCurrentTab('scampedia')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === 'scampedia'
                ? 'bg-orange-500 text-white shadow font-semibold'
                : 'hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scam Pedia</span>
          </button>

          <button
            onClick={() => setCurrentTab('quiz')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === 'quiz'
                ? 'bg-orange-500 text-white shadow font-semibold'
                : 'hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scam IQ Quiz</span>
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 relative ${
              currentTab === 'history'
                ? 'bg-orange-500 text-white shadow font-semibold'
                : 'hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="bg-orange-600 text-[10px] text-white px-1.5 rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right tools: Language selector & Emergency CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <Globe className="w-3.5 h-3.5 ml-2 mr-1 text-slate-400" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition ${
                language === 'en'
                  ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded font-medium transition ${
                language === 'hi'
                  ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('hinglish')}
              className={`px-2 py-1 rounded font-medium transition ${
                language === 'hinglish'
                  ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hinglish
            </button>
          </div>

          {/* Emergency Helplines Button */}
          <button
            onClick={openHelplines}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Cyber Helplines</span>
            <span className="sm:hidden">1930</span>
          </button>
        </div>
      </div>

      {/* Mobile subnavigation scrollable bar */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-900 bg-slate-950/60 no-scrollbar text-xs">
        <button
          onClick={() => setCurrentTab('scanner')}
          className={`px-3 py-1 rounded-lg shrink-0 ${
            currentTab === 'scanner' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          AI Scanner
        </button>
        <button
          onClick={() => setCurrentTab('radar')}
          className={`px-3 py-1 rounded-lg shrink-0 ${
            currentTab === 'radar' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Threat Radar
        </button>
        <button
          onClick={() => setCurrentTab('scampedia')}
          className={`px-3 py-1 rounded-lg shrink-0 ${
            currentTab === 'scampedia' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Scam Pedia
        </button>
        <button
          onClick={() => setCurrentTab('quiz')}
          className={`px-3 py-1 rounded-lg shrink-0 ${
            currentTab === 'quiz' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Radar Quiz
        </button>
        <button
          onClick={() => setCurrentTab('history')}
          className={`px-3 py-1 rounded-lg shrink-0 ${
            currentTab === 'history' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          History ({historyCount})
        </button>
      </div>
    </header>
  );
};
