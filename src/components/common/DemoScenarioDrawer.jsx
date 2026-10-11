import React, { useState } from 'react';
import {
  Sparkles,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Leaf,
  X,
  Play,
} from 'lucide-react';
import { PRELOADED_SCENARIOS } from '../../services/mockData';
import { useCheckStore } from '../../stores/checkStore';
import { useNavigate } from 'react-router-dom';

export function DemoScenarioDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const setActiveCheck = useCheckStore((state) => state.setActiveCheck);
  const activeCheck = useCheckStore((state) => state.activeCheck);

  const handleLaunchScenario = (sc) => {
    setActiveCheck(sc);
    navigate(`/result/${sc.id}`);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-22 left-4 z-40 select-none">
      {/* Expanded Demo Modal / Drawer */}
      {isOpen ? (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-3xl border-2 border-indigo-400/30 shadow-2xl w-80 max-w-[calc(100vw-2rem)] space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                Presenter Demo Scenarios
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Click any scenario during your live demo to immediately show that verification outcome:
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
            {PRELOADED_SCENARIOS.map((sc) => {
              const isSelected = activeCheck?.id === sc.id;
              let Icon = ShieldCheck;
              let iconColor = 'text-teal-400';
              let badgeBg = 'bg-teal-900/60 text-teal-300 border-teal-700/60';

              if (sc.outcomeKey === 'INCONSISTENCY') {
                Icon = AlertTriangle;
                iconColor = 'text-amber-400';
                badgeBg = 'bg-amber-900/60 text-amber-300 border-amber-700/60';
              } else if (sc.outcomeKey === 'UNABLE_TO_VERIFY') {
                Icon = HelpCircle;
                iconColor = 'text-slate-400';
                badgeBg = 'bg-slate-800 text-slate-300 border-slate-700';
              } else if (sc.outcomeKey === 'ECO_SEPARATE') {
                Icon = Leaf;
                iconColor = 'text-emerald-400';
                badgeBg = 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
              }

              return (
                <button
                  key={sc.id}
                  onClick={() => handleLaunchScenario(sc)}
                  className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-900/80 border-indigo-400 ring-2 ring-indigo-400/40'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">
                      {sc.scenarioId}. {sc.title}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${badgeBg}`}>
                        {sc.outcomeKey === 'NO_MISMATCH' && 'No Mismatch'}
                        {sc.outcomeKey === 'INCONSISTENCY' && 'Inconsistency'}
                        {sc.outcomeKey === 'UNABLE_TO_VERIFY' && 'Unreadable'}
                        {sc.outcomeKey === 'ECO_SEPARATE' && 'Eco Claim'}
                      </span>
                    </div>
                  </div>
                  <Play className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Discreet, Unobtrusive Floating Pill (Only you know to tap it during demo!) */
        <button
          onClick={() => setIsOpen(true)}
          title="Open Presenter Demo Cases"
          className="bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700/80 shadow-md backdrop-blur text-[11px] font-bold flex items-center gap-1.5 cursor-pointer active:scale-90 transition opacity-60 hover:opacity-100"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Demo Presets</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </div>
  );
}
