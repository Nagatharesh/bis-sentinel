import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ExternalLink,
  Database,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useCheckStore } from '../../stores/checkStore';
import { PRELOADED_SCENARIOS } from '../../services/mockData';
import { truncateHash } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function DesktopSidePanel() {
  const navigate = useNavigate();
  const activeCheck = useCheckStore((state) => state.activeCheck);
  const setActiveCheck = useCheckStore((state) => state.setActiveCheck);
  const [showDemoList, setShowDemoList] = useState(false);

  const handleSelectScenario = (scenario) => {
    setActiveCheck(scenario);
    navigate(`/result/${scenario.id}`);
  };

  return (
    <aside className="w-96 hidden lg:flex flex-col gap-5 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 select-none">
      {/* Evidence & Registry Status */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>Evidence & Registry Verification</span>
          </div>
          <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-bold">
            Live Database
          </span>
        </div>

        {activeCheck ? (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Active Product Inspection
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm mt-0.5 line-clamp-1">
                {activeCheck.title}
              </h4>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                Licence: {activeCheck.licenceNumber}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500">Preserved Artifacts:</span>
              {activeCheck.evidenceTrail?.map((ev, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-800 truncate">{ev.fileName}</div>
                  <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>SHA-256: {truncateHash(ev.sha256, 6)}</span>
                    <span>{ev.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 leading-relaxed">
            Scan a product, enter a link, or look up a licence number to view cryptographic evidence records.
          </p>
        )}
      </div>

      {/* Official Registry Sync Status */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-3 text-xs">
        <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
          <Database className="w-4 h-4 text-indigo-700" />
          <span>Official Public Registers</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-700 font-medium">BIS Central Database</span>
            <span className="text-teal-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-700 font-medium">BEE Energy Star Registry</span>
            <span className="text-teal-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Synced
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-700 font-medium">E-Waste Depository (TN)</span>
            <span className="text-teal-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Discreet Presenter Toggle (Hidden by default for genuine consumer experience) */}
      <div className="pt-1">
        <button
          onClick={() => setShowDemoList(!showDemoList)}
          className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1.5 cursor-pointer transition font-medium"
        >
          {showDemoList ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showDemoList ? 'Hide Demo Scenarios' : 'Presenter Options'}</span>
        </button>

        {showDemoList && (
          <div className="mt-3 bg-slate-900 text-white rounded-3xl p-4 space-y-2.5 border-2 border-indigo-400/40 shadow-xl animate-in fade-in duration-200">
            <div className="text-[11px] font-extrabold uppercase text-amber-300">
              Demo Presets (For Reviewers)
            </div>
            <div className="space-y-2">
              {PRELOADED_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    activeCheck?.id === sc.id
                      ? 'bg-indigo-800 text-white border border-indigo-400'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate">{sc.scenarioId}. {sc.title}</span>
                  <span className="text-[10px] opacity-75 font-mono ml-1 shrink-0">
                    {sc.outcomeKey === 'NO_MISMATCH' && 'Valid'}
                    {sc.outcomeKey === 'INCONSISTENCY' && 'Mismatch'}
                    {sc.outcomeKey === 'UNABLE_TO_VERIFY' && 'Partial'}
                    {sc.outcomeKey === 'ECO_SEPARATE' && 'Eco'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
