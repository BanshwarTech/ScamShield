import React from 'react';
import { PhoneCall, ShieldAlert, ExternalLink, X, Building, CheckCircle, AlertTriangle } from 'lucide-react';
import { Language } from '../types/scam';

interface HelplinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const HelplinesModal: React.FC<HelplinesModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const helplines = [
    {
      name: 'National Cyber Crime Helpline (MHA / I4C)',
      number: '1930',
      actionUrl: 'tel:1930',
      tag: 'Critical Emergency (24x7)',
      tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      desc: 'Dial within 1 hour ("Golden Hour") of unauthorized bank transfer. Integrates 250+ banks, wallets & police forces to immediately freeze stolen funds in transit.',
      webUrl: 'https://cybercrime.gov.in',
    },
    {
      name: 'Chakshu Portal (DoT Sanchar Saathi)',
      number: 'sancharsaathi.gov.in',
      actionUrl: 'https://sancharsaathi.gov.in/sfc/',
      tag: 'SIM & Telecom Blacklist',
      tagColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      desc: 'Report suspected fraud SMS, WhatsApp messages, and scam phone numbers directly to Department of Telecommunications for immediate disconnection.',
      webUrl: 'https://sancharsaathi.gov.in/sfc/',
    },
    {
      name: 'RBI Sachet Portal',
      number: 'sachet.rbi.org.in',
      actionUrl: 'https://sachet.rbi.org.in',
      tag: 'Illegal Loan & Investment Apps',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      desc: 'Lodge complaints against unregistered finance apps, extortionist 7-day loan apps, and fraudulent deposit schemes.',
      webUrl: 'https://sachet.rbi.org.in',
    },
    {
      name: 'SEBI SCORES Portal',
      number: '1800 266 7575',
      actionUrl: 'tel:18002667575',
      tag: 'Stock Market & Telegram Advisory',
      tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      desc: 'Report fake stock market advisory groups, VIP Telegram channels promising 500% returns, and unauthorized portfolio managers.',
      webUrl: 'https://scores.sebi.gov.in',
    },
    {
      name: 'National Consumer Helpline (NCH)',
      number: '1915',
      actionUrl: 'tel:1915',
      tag: 'Shopping & Delivery Fraud',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      desc: 'For fake e-commerce shopping portals, non-delivery of prepaid orders, and deceptive online consumer practices.',
      webUrl: 'https://consumerhelpline.gov.in',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-6 h-6 text-orange-400" />
          <h3 className="text-xl font-black text-white tracking-tight">
            Official Indian Cyber Safety Directory
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Government of India authorized helplines and reporting portals. Free of charge and available to all citizens.
        </p>

        {/* Emergency Golden Hour Highlight */}
        <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-600/40 flex items-start gap-3">
          <PhoneCall className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-300">
              Money Transferred Already? Golden Hour Protocol:
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              If money has been deducted from your account, dial <strong className="text-white underline">1930</strong> immediately. The Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) contacts recipient banks to freeze the funds before the scammer withdraws them at an ATM.
            </p>
          </div>
        </div>

        {/* Directory List */}
        <div className="space-y-3">
          {helplines.map((h, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${h.tagColor}`}>
                    {h.tag}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {h.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {h.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                {h.actionUrl.startsWith('tel:') ? (
                  <a
                    href={h.actionUrl}
                    className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Dial {h.number}</span>
                  </a>
                ) : (
                  <a
                    href={h.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-lg border border-slate-700 transition"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
