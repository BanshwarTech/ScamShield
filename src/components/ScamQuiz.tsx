import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award, ArrowRight, ShieldAlert } from 'lucide-react';
import { quizQuestions } from '../data/quizData';
import { Language } from '../types/scam';

interface ScamQuizProps {
  language: Language;
}

export const ScamQuiz: React.FC<ScamQuizProps> = ({ language }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = quizQuestions[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (currentQ.options[index].isSafe) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const getRankBadge = () => {
    if (score === 5) {
      return {
        title: '🛡️ Cyber Rakshak (Scam Master)',
        desc: 'Incredible vigilance! You are virtually immune to everyday Indian digital payment frauds.',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      };
    } else if (score >= 3) {
      return {
        title: '⚠️ Cyber Vigilant',
        desc: 'Good awareness, but review the red flags around UPI PIN collection and fake emergency calls.',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      };
    } else {
      return {
        title: '🚨 High Vulnerability',
        desc: 'You are at imminent risk of losing money to digital scams. Read our Scam Pedia immediately!',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Test Your Scam Radar: Interactive Simulator
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real Indian situations. Would you spot the fraud or fall into the trap?
          </p>
        </div>

        {!isCompleted && (
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">Question</span>
            <div className="text-lg font-black text-white">
              {currentIdx + 1} / {quizQuestions.length}
            </div>
          </div>
        )}
      </div>

      {!isCompleted ? (
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Context Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              Scenario #{currentIdx + 1}: {currentQ.contextType}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Current Score: <strong className="text-white">{score}</strong>
            </span>
          </div>

          {/* Scenario Text */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            "{language === 'hi' ? currentQ.scenarioHindi : currentQ.scenario}"
          </div>

          {/* Options */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              What would you do?
            </span>
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800/80 hover:border-slate-700';

              if (isAnswered) {
                if (opt.isSafe) {
                  btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
                } else if (isChosen && !opt.isSafe) {
                  btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'opacity-40 bg-slate-950 border-slate-900 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-semibold transition flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span>{language === 'hi' ? opt.textHindi : opt.text}</span>
                  {isAnswered && opt.isSafe && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isChosen && !opt.isSafe && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {currentQ.verdict}: {currentQ.realScamName}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'hi' ? currentQ.explanationHindi : currentQ.explanation}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  <span>{currentIdx + 1 === quizQuestions.length ? 'See Final Score' : 'Next Scenario'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto text-white shadow-xl shadow-orange-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">Simulation Completed!</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Your Scam Detection Accuracy:</p>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 mt-2">
              {score} / {quizQuestions.length}
            </div>
          </div>

          {/* Rank Badge */}
          {(() => {
            const rank = getRankBadge();
            return (
              <div className={`p-5 rounded-2xl border max-w-md mx-auto ${rank.color}`}>
                <h4 className="font-extrabold text-base mb-1">{rank.title}</h4>
                <p className="text-xs leading-relaxed opacity-90">{rank.desc}</p>
              </div>
            );
          })()}

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={() => {
                const text = `I just tested my digital scam defense on ScamShield India and scored ${score}/5! Test how well you spot UPI and police video call scams:`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
            >
              <span>Challenge Friends on WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
