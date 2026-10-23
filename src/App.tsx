import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  Flame,
  BookOpen,
  HelpCircle,
  History,
  Lock,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle,
  Users
} from 'lucide-react';
import { Header } from './components/Header';
import { ScannerTabs } from './components/ScannerTabs';
import { AnalysisResultView } from './components/AnalysisResultView';
import { ThreatRadar } from './components/ThreatRadar';
import { ScamPedia } from './components/ScamPedia';
import { ScamQuiz } from './components/ScamQuiz';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HelplinesModal } from './components/HelplinesModal';
import { AnalysisResult, InputType, Language } from './types/scam';
import { translations } from './data/translations';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('scanner');
  const [language, setLanguage] = useState<Language>('en');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [showHelplines, setShowHelplines] = useState<boolean>(false);

  const t = translations[language];

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem('scamshield_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (result: AnalysisResult) => {
    try {
      const updated = [result, ...history.filter((h) => h.id !== result.id)].slice(0, 30);
      setHistory(updated);
      localStorage.setItem('scamshield_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to history:', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('scamshield_history');
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };

  // Perform AI Scam Analysis via server-side endpoint
  const handleAnalyze = async (type: InputType, content: string, imageData?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          content,
          imageData,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete scam analysis.');
      }

      setAnalysisResult(data.result);
      saveToHistory(data.result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Error communicating with detection engine. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setErrorMessage(null);
        }}
        language={language}
        setLanguage={setLanguage}
        historyCount={history.length}
        openHelplines={() => setShowHelplines(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Error notification if any */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-500/50 rounded-xl p-4 flex items-center justify-between text-xs sm:text-sm text-rose-200 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: AI SCANNER */}
        {currentTab === 'scanner' && (
          <div className="space-y-8">
            {/* Hero intro when not viewing a result */}
            {!analysisResult && (
              <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 sm:pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>National Cyber Crime & NPCI Aligned Security</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {t.heroTitle}
                </h1>

                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  {t.heroSubtitle}
                </p>

                {/* Micro trust metrics */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Multimodal Vision OCR</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>UPI & Bank KYC Rules</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>English, हिंदी & Hinglish</span>
                  </span>
                </div>
              </div>
            )}

            {/* If there is a result, show the detailed result view. Otherwise show ScannerTabs. */}
            {analysisResult ? (
              <AnalysisResultView
                result={analysisResult}
                onReset={() => setAnalysisResult(null)}
                language={language}
              />
            ) : (
              <ScannerTabs
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                language={language}
              />
            )}

            {/* Value Proposition Cards / Educational highlights below scanner */}
            {!analysisResult && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div
                  onClick={() => setCurrentTab('scampedia')}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-3 group-hover:scale-110 transition">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-sm group-hover:text-orange-300 transition">
                    UPI PIN Protection
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Remember: You NEVER enter your UPI PIN to receive money. Scanning a QR code is strictly to send payment.
                  </p>
                </div>

                <div
                  onClick={() => setCurrentTab('radar')}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 transition">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-sm group-hover:text-rose-300 transition">
                    Digital Arrest Warning
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    There is NO legal concept called "Digital Arrest". Police and CBI never conduct arrests on WhatsApp or Skype video calls.
                  </p>
                </div>

                <div
                  onClick={() => setShowHelplines(true)}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition">
                    1930 Golden Hour
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Call 1930 immediately within the golden hour if you accidentally sent funds to freeze the receiver bank account.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE THREAT RADAR */}
        {currentTab === 'radar' && <ThreatRadar language={language} />}

        {/* TAB 3: SCAM PEDIA */}
        {currentTab === 'scampedia' && <ScamPedia language={language} />}

        {/* TAB 4: SCAM RADAR QUIZ */}
        {currentTab === 'quiz' && <ScamQuiz language={language} />}

        {/* TAB 5: HISTORY */}
        {currentTab === 'history' && (
          <HistoryDrawer
            history={history}
            onSelectScan={(item) => {
              setAnalysisResult(item);
              setCurrentTab('scanner');
            }}
            onClearHistory={clearHistory}
            language={language}
          />
        )}
      </main>

      {/* Helplines Modal */}
      <HelplinesModal
        isOpen={showHelplines}
        onClose={() => setShowHelplines(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400 mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">ScamShield India</span>
              <span className="block text-[11px] text-slate-500">
                Think before you click. Check before you pay. Verify before you trust.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>National Cyber Crime Portal (1930)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://sancharsaathi.gov.in/sfc/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>DoT Chakshu Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://sachet.rbi.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>RBI Sachet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-5 pt-4 border-t border-slate-900 text-[11px] text-slate-500 text-center leading-relaxed">
          {t.disclaimer}
        </div>
      </footer>
    </div>
  );
}
