import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Share2,
  PhoneCall,
  ExternalLink,
  RotateCcw,
  Building,
  Smartphone,
  Link,
  CreditCard,
  Copy,
  Check
} from 'lucide-react';
import { AnalysisResult, Language } from '../types/scam';
import { translations } from '../data/translations';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
  language: Language;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  onReset,
  language,
}) => {
  const [copied, setCopied] = React.useState(false);
  const t = translations[language];

  // Colors & badges based on risk level
  const getRiskDetails = (level: string, score: number) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-950/40 border-rose-600/60 text-rose-300',
          badgeBg: 'bg-rose-600 text-white',
          glow: 'shadow-rose-600/30',
          ringColor: '#e11d48',
          icon: ShieldAlert,
          title: 'CRITICAL RISK DETECTED',
          titleHindi: 'अत्यधिक गंभीर खतरा (CRITICAL RISK)',
          desc: 'Do not interact! High probability of severe financial fraud or credential harvesting.',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-950/40 border-orange-600/60 text-orange-300',
          badgeBg: 'bg-orange-600 text-white',
          glow: 'shadow-orange-600/30',
          ringColor: '#ea580c',
          icon: AlertTriangle,
          title: 'HIGH RISK DETECTED',
          titleHindi: 'उच्च जोखिम (HIGH RISK)',
          desc: 'Strong deceptive indicators detected. Exercise extreme caution.',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-950/40 border-amber-600/60 text-amber-300',
          badgeBg: 'bg-amber-600 text-slate-950',
          glow: 'shadow-amber-600/30',
          ringColor: '#d97706',
          icon: AlertTriangle,
          title: 'MODERATE RISK',
          titleHindi: 'मध्यम जोखिम (MODERATE RISK)',
          desc: 'Unverified source or ambiguous elements found. Verify independently.',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300',
          badgeBg: 'bg-emerald-600 text-white',
          glow: 'shadow-emerald-600/30',
          ringColor: '#059669',
          icon: ShieldCheck,
          title: 'LOW RISK / LEGITIMATE PATTERN',
          titleHindi: 'कम जोखिम (SAFE / LOW RISK)',
          desc: 'Matches known standard official communication patterns. Practice ordinary diligence.',
        };
    }
  };

  const riskInfo = getRiskDetails(result.risk_level, result.risk_score);
  const StatusIcon = riskInfo.icon;

  const handleShareWhatsApp = () => {
    const textToShare = `🚨 *Scam Alert via ScamShield India* 🚨\n\n*Verdict:* ${result.risk_level} RISK (${result.risk_score}/100)\n*Category:* ${result.category}\n\n*Why Suspicious:* ${result.summary}\n\n⚠️ *DO NOT:* ${result.do_not?.[0] || 'Do not click links or share OTP'}\n\nStay alert! Verified via ScamShield India.`;
    const url = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
    window.open(url, '_blank');
  };

  const handleCopySummary = () => {
    const text = `ScamShield India Report: ${result.risk_level} Risk (${result.risk_score}/100) - ${result.category}. ${result.summary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Card with Score Gauge */}
      <div className={`rounded-2xl border p-5 sm:p-7 backdrop-blur-md shadow-2xl ${riskInfo.bg} ${riskInfo.glow}`}>
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          {/* Left info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3 border border-current">
              <StatusIcon className="w-4 h-4" />
              <span>{riskInfo.title}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {result.category}
            </h2>

            <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              {result.summary}
            </p>

            {/* Multilingual localized summary block if present */}
            {result.multilingual_summary && result.multilingual_summary !== result.summary && (
              <div className="mt-3 p-3 bg-black/30 rounded-xl border border-white/10 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                <span className="font-semibold text-amber-300 block text-[11px] uppercase tracking-wider mb-0.5">
                  {language === 'hi' ? 'हिंदी में समझें (Hindi Summary)' : 'Hinglish Explanation'}
                </span>
                {result.multilingual_summary}
              </div>
            )}
          </div>

          {/* Right Circular / Dial Gauge Score */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[180px] shadow-inner shrink-0">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800"
                />
                {/* Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={riskInfo.ringColor}
                  strokeWidth="8"
                  strokeDasharray={`${(result.risk_score / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{result.risk_score}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ 100</span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${riskInfo.badgeBg}`}>
                {result.risk_level}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                AI Confidence: <strong className="text-slate-200">{result.confidence_score || 95}%</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Action bar on top */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg font-bold shadow transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.shareWhatsApp}</span>
            </button>
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Verdict'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-800/80 px-3.5 py-2 rounded-lg font-medium transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Another Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: WHY SUSPICIOUS vs DO NOT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why Suspicious signals */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              {t.whySuspicious}
            </h3>
          </div>

          <div className="space-y-3">
            {result.why_suspicious?.map((sig, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-slate-100">
                      {sig.signal}
                    </span>
                    {sig.severity && (
                      <span
                        className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                          sig.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : sig.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {sig.severity}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {sig.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What You Must NOT Do (DO NOT) */}
        <div className="bg-gradient-to-b from-rose-950/30 to-slate-900/90 border border-rose-900/40 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-rose-900/30">
            <XCircle className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white text-base">
              {t.doNot}
            </h3>
          </div>

          <div className="space-y-2.5">
            {result.do_not?.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3"
              >
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-rose-200">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Golden advice footer */}
          <div className="mt-4 p-3 rounded-xl bg-black/40 border border-rose-500/20 text-[11px] text-rose-300/90">
            <strong>Remember: </strong> No bank, tax authority or police officer in India will ever ask you to verify a PIN, download AnyDesk, or transfer money to a "safety escrow".
          </div>
        </div>
      </div>

      {/* Grid: Recommended Actions & Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Actions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              {t.recommendedActions}
            </h3>
          </div>

          <ol className="space-y-3">
            {result.recommended_actions?.map((act, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-slate-200 font-medium">
                  {act}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* How To Verify Independently & Helplines */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Building className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">
                {t.howToVerify}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {result.how_to_verify}
            </p>

            {/* Extracted Entities */}
            {result.extracted_entities && (
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Detected Entities in Scanned Content:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {result.extracted_entities.phone_numbers?.map((p, i) => (
                    <span key={i} className="flex items-center gap-1 bg-slate-800 text-slate-200 px-2 py-1 rounded-md border border-slate-700">
                      <Smartphone className="w-3 h-3 text-orange-400" />
                      {p}
                    </span>
                  ))}
                  {result.extracted_entities.urls?.map((u, i) => (
                    <span key={i} className="flex items-center gap-1 bg-slate-800 text-rose-300 px-2 py-1 rounded-md border border-slate-700 truncate max-w-xs">
                      <Link className="w-3 h-3 text-rose-400" />
                      {u}
                    </span>
                  ))}
                  {result.extracted_entities.upi_ids?.map((v, i) => (
                    <span key={i} className="flex items-center gap-1 bg-slate-800 text-amber-300 px-2 py-1 rounded-md border border-slate-700">
                      <CreditCard className="w-3 h-3 text-amber-400" />
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Official Emergency Help CTA */}
          <div className="mt-6 pt-4 border-t border-slate-800 bg-slate-950/50 p-3.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">MHA Cyber Crime Helpline</span>
                <span className="text-[11px] text-slate-400">Dial 1930 within the golden hour</span>
              </div>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 px-3 py-1.5 rounded-lg transition"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
