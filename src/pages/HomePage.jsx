import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Link as LinkIcon,
  Search,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MANDATORY_CATEGORIES, PRELOADED_SCENARIOS } from '../services/mockData';
import { useCheckStore } from '../stores/checkStore';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../lib/utils';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setActiveCheck = useCheckStore((state) => state.setActiveCheck);

  const handleOpenScenario = (scenario) => {
    setActiveCheck(scenario);
    navigate(`/result/${scenario.id}`);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Hero card with bubble badge */}
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white rounded-3xl p-6 shadow-elevated relative overflow-hidden border-2 border-indigo-700/50">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-indigo-700/80 border border-indigo-400/40 text-teal-300 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Official Registry Verification
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-3 leading-tight tracking-tight">
            {t('home.greeting')}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-1.5 leading-relaxed font-medium">
            {t('home.subtitle')}
          </p>
        </div>
      </div>

      {/* 3 Main Action BUBBLE CARDS */}
      <div className="space-y-3.5">
        {/* 1. Scan Product (Big Camera Bubble) */}
        <button
          onClick={() => navigate('/check/capture')}
          className="w-full text-left bg-white p-4 sm:p-5 rounded-3xl border-2 border-slate-200/90 shadow-subtle hover:border-indigo-600 hover:shadow-card active:scale-[0.98] transition-all duration-200 flex items-center gap-4 cursor-pointer group"
        >
          {/* Circular Camera Bubble Button Icon */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-950 to-indigo-800 text-white group-hover:scale-105 transition-transform flex items-center justify-center shrink-0 shadow-md ring-4 ring-indigo-100 group-hover:ring-indigo-200">
            <Camera className="w-8 h-8 text-teal-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                {t('home.actionScan')}
              </h3>
              <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-indigo-900 group-hover:text-white flex items-center justify-center transition-all duration-200">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
              {t('home.actionScanDesc')}
            </p>
          </div>
        </button>

        {/* 2. Paste Listing Link (Bubble Link Card) */}
        <button
          onClick={() => navigate('/check/listing')}
          className="w-full text-left bg-white p-4 sm:p-5 rounded-3xl border-2 border-slate-200/90 shadow-subtle hover:border-teal-600 hover:shadow-card active:scale-[0.98] transition-all duration-200 flex items-center gap-4 cursor-pointer group"
        >
          {/* Circular Link Bubble Button Icon */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-900 to-teal-700 text-white group-hover:scale-105 transition-transform flex items-center justify-center shrink-0 shadow-md ring-4 ring-teal-100 group-hover:ring-teal-200">
            <LinkIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                {t('home.actionLink')}
              </h3>
              <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-teal-800 group-hover:text-white flex items-center justify-center transition-all duration-200">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
              {t('home.actionLinkDesc')}
            </p>
          </div>
        </button>

        {/* 3. Enter Licence Number (Bubble Search Card) */}
        <button
          onClick={() => navigate('/check/licence')}
          className="w-full text-left bg-white p-4 sm:p-5 rounded-3xl border-2 border-slate-200/90 shadow-subtle hover:border-slate-800 hover:shadow-card active:scale-[0.98] transition-all duration-200 flex items-center gap-4 cursor-pointer group"
        >
          {/* Circular Search Bubble Button Icon */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 text-white group-hover:scale-105 transition-transform flex items-center justify-center shrink-0 shadow-md ring-4 ring-slate-200 group-hover:ring-slate-300">
            <Search className="w-8 h-8 text-amber-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                {t('home.actionLicence')}
              </h3>
              <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-all duration-200">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
              {t('home.actionLicenceDesc')}
            </p>
          </div>
        </button>
      </div>

      {/* Mandatory ISI Category Strip (Bubble Pills) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-slate-900 text-sm">
            {t('home.mandatoryStrip')}
          </h3>
          <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 font-bold px-3 py-1 rounded-full">
            Mandatory QCOs
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {MANDATORY_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-3.5 border-2 border-slate-200 shrink-0 w-38 shadow-2xs hover:border-indigo-300 transition"
            >
              <span className="text-[10px] font-mono text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
                {cat.standard}
              </span>
              <h4 className="font-bold text-slate-900 text-xs mt-2 line-clamp-1">
                {cat.name}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-loaded Scenarios Spotlight */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              {t('home.recentChecks')}
            </h3>
            <p className="text-xs text-slate-500">Tap to inspect official records</p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
          >
            <span>{t('home.viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {PRELOADED_SCENARIOS.map((sc) => {
            let statusBadge = (
              <span className="text-[11px] bg-teal-50 text-teal-800 border-2 border-teal-200 px-3 py-1 rounded-full font-extrabold shadow-2xs">
                No mismatch
              </span>
            );
            if (sc.outcomeKey === 'INCONSISTENCY') {
              statusBadge = (
                <span className="text-[11px] bg-amber-50 text-amber-900 border-2 border-amber-300 px-3 py-1 rounded-full font-extrabold shadow-2xs">
                  Needs review
                </span>
              );
            } else if (sc.outcomeKey === 'UNABLE_TO_VERIFY') {
              statusBadge = (
                <span className="text-[11px] bg-slate-100 text-slate-800 border-2 border-slate-300 px-3 py-1 rounded-full font-extrabold shadow-2xs">
                  Incomplete
                </span>
              );
            } else if (sc.outcomeKey === 'ECO_SEPARATE') {
              statusBadge = (
                <span className="text-[11px] bg-emerald-50 text-emerald-900 border-2 border-emerald-300 px-3 py-1 rounded-full font-extrabold shadow-2xs">
                  EcoLoop
                </span>
              );
            }

            return (
              <button
                key={sc.id}
                onClick={() => handleOpenScenario(sc)}
                className="w-full text-left bg-white p-3.5 sm:p-4 rounded-3xl border-2 border-slate-200/90 shadow-2xs hover:border-indigo-400 active:scale-[0.99] transition-all cursor-pointer flex items-center gap-3.5"
              >
                {sc.productImage && (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                    <img
                      src={sc.productImage}
                      alt={sc.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1">
                      {sc.title}
                    </h4>
                    {statusBadge}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                    <span>{sc.licenceNumber}</span>
                    <span>•</span>
                    <span>{sc.standardNumber}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1 leading-relaxed">
                    {sc.summarySentence}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
