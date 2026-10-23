import React, { useState, useRef } from 'react';
import {
  MessageSquare,
  Image as ImageIcon,
  Link2,
  QrCode,
  Phone,
  Upload,
  X,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Info,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { InputType, Language } from '../types/scam';
import { translations } from '../data/translations';

interface ScannerTabsProps {
  onAnalyze: (type: InputType, content: string, imageData?: string) => Promise<void>;
  isLoading: boolean;
  language: Language;
}

// Preset realistic Indian scam test samples for 1-tap testing
const SAMPLE_PRESETS: Record<InputType, { label: string; text: string; sub: string }[]> = {
  message: [
    {
      label: '🚨 SBI Account Blocked (APK)',
      text: 'Dear Customer, Your SBI Account 49102 will be blocked today! Your PAN card is not updated with KYC. Please download and verify immediately: https://sbi-kyc-update.xyz/sbi_yono.apk to keep account active.',
      sub: 'Phishing APK & Bank Impersonation',
    },
    {
      label: '⚡ Electricity Power Cut',
      text: 'Dear consumer, your electricity power will be disconnected at 9:30 PM tonight from electricity office because your previous month bill was not updated. Please immediately contact our officer Verma at 98210-44291.',
      sub: 'Discom Impersonation & Panic Scam',
    },
    {
      label: '💼 YouTube Like Job ₹5,000/Day',
      text: 'Hello! I am Priya from HR Global. We offer part-time remote work for students and housewives. Earn ₹3,000 - ₹8,000 daily by simply subscribing and liking YouTube videos. No experience needed. Join Telegram: t.me/vip_tasks_daily',
      sub: 'Telegram Task & Investment Scam',
    },
    {
      label: '📦 FedEx Customs Drugs Parcel',
      text: 'This is an urgent automated alert from FedEx Customs Cargo Mumbai. A parcel bearing consignment #FX-9128 containing 16 Passports, 5 Credit Cards and 140g MDMA drugs addressed in your name has been seized. Immediate legal arrest warrant issued by Cyber Crime CBI.',
      sub: 'Digital Arrest / Police Extortion',
    },
    {
      label: '🟢 Safe Bank OTP Sample',
      text: '839201 is your OTP for transaction of INR 350.00 at SWIGGY with HDFC Bank Card ending 1204. Valid for 5 minutes. Do not share OTP with anyone including bank staff.',
      sub: 'Authentic 2FA Notification',
    },
  ],
  url: [
    {
      label: '🔗 Fake SBI NetBanking Link',
      text: 'https://secure-sbi-online-kyc-portal.xyz/login.php?ref=urgent',
      sub: 'Credential Harvesting Phishing Link',
    },
    {
      label: '🎁 Fake Lottery / KBC Link',
      text: 'https://kbc-jiolottery-winner2026.online/claim?prize=25lakh',
      sub: 'Lottery Advance Fee Fraud',
    },
    {
      label: '🟢 Real HDFC Bank URL',
      text: 'https://netbanking.hdfcbank.com/netbanking/',
      sub: 'Authentic Official Bank Portal',
    },
  ],
  phone: [
    {
      label: '📞 Fake Swiggy Refund Helpline',
      text: '+91 82920 19382',
      sub: 'Search Engine Poisoned Customer Care',
    },
    {
      label: '📞 International Job Scam (+62)',
      text: '+62 813 8920 1492',
      sub: 'Unsolicited WhatsApp Recruiter',
    },
    {
      label: '📞 Police Impersonation Caller',
      text: '+91 98210 44291',
      sub: 'Fake CBI Digital Arrest Threat',
    },
  ],
  qr: [
    {
      label: '💳 Fake QR "Receive Money" Scam',
      text: 'upi://pay?pa=refund-desk992@ibl&pn=RefundDesk&am=15000&cu=INR&tn=Refund_Approved_Scan_PIN_To_Receive',
      sub: 'Inverted UPI PIN Collection Attack',
    },
    {
      label: '💳 Fake Army Officer OLX VPA',
      text: 'cisf-defense-canteen@okhdfcbank',
      sub: 'Impersonated Military Buyer',
    },
  ],
  screenshot: [
    {
      label: '📸 Fake Paytm Payment Receipt Sample',
      text: 'PAYMENT SUCCESSFUL to Ramesh Stores ₹4,850 on 23 Oct 2026 at 11:42 AM. Ref No: 492018392104 (Spoof App Checkmark)',
      sub: 'Simulated Spoof App Screenshot',
    },
  ],
  payment: [],
};

export const ScannerTabs: React.FC<ScannerTabsProps> = ({ onAnalyze, isLoading, language }) => {
  const [activeTab, setActiveTab] = useState<InputType>('message');
  const [content, setContent] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [loadingStep, setLoadingStep] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  const handleTabSwitch = (tab: InputType) => {
    setActiveTab(tab);
    setContent('');
    setPreviewImage(null);
    setImageFileName('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !previewImage) {
      return;
    }

    // Step-by-step loading animation
    setLoadingStep('Reading content & inspecting cybercrime indicators...');
    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Cross-referencing NPCI, RBI & Indian Cyber Threat database...');
    }, 1200);
    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Evaluating risk score, red flags & safe action plan...');
    }, 2400);

    try {
      await onAnalyze(activeTab, content, previewImage || undefined);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoadingStep('');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
      {/* Tab Selectors */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 no-scrollbar">
        <button
          type="button"
          onClick={() => handleTabSwitch('message')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'message'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.tabs.message}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('screenshot')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'screenshot'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{t.tabs.screenshot}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('url')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'url'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>{t.tabs.url}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('qr')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'qr'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{t.tabs.qr}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('phone')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'phone'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>{t.tabs.phone}</span>
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* TAB 1: Message / SMS */}
        {activeTab === 'message' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Paste Suspicious SMS, WhatsApp, or Notice
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder={t.messagePlaceholder}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              />
              {content && (
                <button
                  type="button"
                  onClick={() => setContent('')}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-800/80 p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
              <span>Supports English, Hindi, Hinglish, & regional scripts</span>
              <span>{content.length} characters</span>
            </div>
          </div>
        )}

        {/* TAB 2: Screenshot OCR */}
        {activeTab === 'screenshot' && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />

            {!previewImage ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-orange-500/80 bg-slate-950/50 hover:bg-slate-950/80 rounded-xl p-8 text-center cursor-pointer transition group"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-200">
                  {t.dragDropImage}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {t.uploadSupported}
                </p>
              </div>
            ) : (
              <div className="relative border border-slate-700 bg-slate-950 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={previewImage}
                  alt="Screenshot preview"
                  className="max-h-48 w-auto rounded-lg object-contain bg-black/40 border border-slate-800"
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                      {imageFileName || 'Screenshot loaded'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Gemini multimodal vision will extract text, detect fake UI artifacts, and inspect sender authenticity.
                  </p>
                  <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-200 font-medium transition"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setImageFileName('');
                      }}
                      className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-3 py-1.5 rounded-lg font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Optional extra context note */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Optional: Add any context or what the sender asked you to do
              </label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g. Sender sent this payment receipt and is asking me to release goods immediately"
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {/* TAB 3: URL / Link */}
        {activeTab === 'url' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Enter Suspicious URL, Shortlink or Web Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.urlPlaceholder}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              {content && (
                <button
                  type="button"
                  onClick={() => setContent('')}
                  className="absolute top-2.5 right-3 text-slate-400 hover:text-white bg-slate-800/80 p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Analyzes typosquatting, deceptive subdomains, fake bank portals, APK download payloads, and known blacklist patterns.
            </p>
          </div>
        )}

        {/* TAB 4: QR Code & UPI */}
        {activeTab === 'qr' && (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Golden UPI Rule: </span>
                You NEVER enter your UPI PIN to receive money. Scanning a QR code or entering a PIN always deducts money from your account.
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Enter UPI ID (VPA) or Payment String
              </label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.qrPlaceholder}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Also allow QR code screenshot upload */}
            <div>
              <span className="block text-xs text-slate-400 mb-1.5">Or upload a QR code image to decode payload:</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30"
              />
              {previewImage && (
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>QR Image attached for vision decoding</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Phone Number */}
        {activeTab === 'phone' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Enter Indian Phone Number or WhatsApp Caller ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              {content && (
                <button
                  type="button"
                  onClick={() => setContent('')}
                  className="absolute top-2.5 right-3 text-slate-400 hover:text-white bg-slate-800/80 p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Checks against known cybercrime threat intelligence, reported customer care imposters, and international scam prefixes (+62, +92, +880, +234).
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading || (!content.trim() && !previewImage)}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition shadow-xl flex items-center justify-center gap-2.5 ${
              isLoading || (!content.trim() && !previewImage)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{loadingStep || t.analyzingBtn}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{t.analyzeBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Test Examples for Rapid Discovery */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.tryExamples}</span>
          </span>
          <span className="text-[10px] text-slate-500">Click any sample to test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_PRESETS[activeTab]?.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setContent(sample.text)}
              className="text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/40 transition group"
            >
              <div className="text-xs font-semibold text-slate-200 group-hover:text-orange-300 truncate">
                {sample.label}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {sample.sub}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
