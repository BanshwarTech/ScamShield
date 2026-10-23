import React, { useState, useEffect } from 'react';
import { Flame, ShieldAlert, ThumbsUp, MapPin, Clock, Plus, Search, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { ThreatItem, Language } from '../types/scam';

interface ThreatRadarProps {
  language: Language;
}

export const ThreatRadar: React.FC<ThreatRadarProps> = ({ language }) => {
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form states
  const [newTarget, setNewTarget] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('UPI Fraud');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newCity, setNewCity] = useState<string>('Delhi NCR');
  const [reportedSuccess, setReportedSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetchThreats();
  }, [filter]);

  const fetchThreats = async () => {
    try {
      const url = filter === 'All' ? '/api/threat-feed' : `/api/threat-feed?category=${encodeURIComponent(filter)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.threats)) {
        setThreats(data.threats);
      }
    } catch (err) {
      console.error('Failed to fetch threat radar:', err);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`/api/report/${id}/upvote`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setThreats((prev) =>
          prev.map((item) => (item.id === id ? { ...item, upvotes: data.upvotes } : item))
        );
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget.trim() || !newDescription.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetValue: newTarget,
          targetType: newTarget.includes('http') ? 'url' : newTarget.includes('@') ? 'upi' : 'phone',
          category: newCategory,
          description: newDescription,
          city: newCity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReportedSuccess(true);
        setTimeout(() => {
          setReportedSuccess(false);
          setShowReportModal(false);
          setNewTarget('');
          setNewDescription('');
          fetchThreats();
        }, 1500);
      }
    } catch (err) {
      console.error('Report submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredThreats = threats.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.targetValue.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const categories = ['All', 'Digital Arrest', 'UPI', 'KYC', 'Electricity', 'Job Scam', 'Customer Care'];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span>Live India Scam Threat Radar</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time cyber attacks, fake numbers, and phishing domains reported across Indian cities.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report a New Scam</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                filter === cat
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city, category, or number..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Threats Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredThreats.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {item.category}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.city}, {item.state}</span>
                </div>
              </div>

              {/* Target identifier */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 my-2 font-mono text-xs text-rose-300 break-all flex items-center justify-between">
                <span>{item.targetValue}</span>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider ml-2 bg-rose-500/10 px-1.5 py-0.5 rounded">
                  Risk: {item.riskScore}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{item.reportedAt}</span>
              </div>

              <button
                onClick={() => handleUpvote(item.id)}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 px-3 py-1 rounded-lg text-slate-200 transition text-xs font-semibold"
              >
                <ThumbsUp className="w-3 h-3 text-amber-400" />
                <span>Verify ({item.upvotes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredThreats.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
          <ShieldAlert className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-sm">No threats found matching this search criteria.</p>
        </div>
      )}

      {/* Report a Scam Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span>Report a Scam to Community Radar</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Help protect fellow citizens from fraudulent callers, fake websites, and WhatsApp extortion.
            </p>

            {reportedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white">Thank you for reporting!</h4>
                <p className="text-xs text-slate-400">Your threat indicator has been added to the live feed.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Scam Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Digital Arrest / Police Impersonation">Digital Arrest / Police Impersonation</option>
                    <option value="UPI Collect & QR Refund Fraud">UPI Collect & QR Refund Fraud</option>
                    <option value="Bank KYC APK Phishing">Bank KYC APK Phishing</option>
                    <option value="Electricity Bill Disconnection">Electricity Bill Disconnection</option>
                    <option value="Part-Time Telegram Job Scam">Part-Time Telegram Job Scam</option>
                    <option value="Fake Customer Care Poisoning">Fake Customer Care Poisoning</option>
                    <option value="Courier / Customs Drugs Scam">Courier / Customs Drugs Scam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Identifier (Phone number, URL, or UPI ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="e.g. +91 98210 44291 or sbi-pan-kyc.xyz"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="e.g. Bengaluru, Mumbai"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Urgency Level
                    </label>
                    <span className="text-xs text-rose-400 font-bold block pt-2">Active Cyber Hazard</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    What happened? (Describe the scammer's modus operandi)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="e.g. Caller claimed to be FedEx Customs and demanded a video call to clear a parcel..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2 rounded-xl transition"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Threat Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
