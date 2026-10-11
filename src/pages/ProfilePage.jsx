import React, { useState } from 'react';
import {
  UserCircle,
  Globe,
  Type,
  SunMoon,
  Download,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Wifi,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../stores/appStore';
import { historyService } from '../services/historyService';
import { useTranslation } from 'react-i18next';

export function ProfilePage() {
  const { t, i18n } = useTranslation();
  const selectedLang = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const fontScale = useAppStore((state) => state.fontScale);
  const setFontScale = useAppStore((state) => state.setFontScale);
  const highContrast = useAppStore((state) => state.highContrast);
  const toggleHighContrast = useAppStore((state) => state.toggleHighContrast);

  const [exportNotice, setExportNotice] = useState('');
  const [clearNotice, setClearNotice] = useState('');

  const apiKeyPresent = !!import.meta.env.VITE_GEMINI_API_KEY;

  const languages = [
    { code: 'en', name: 'English (Indian English)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
  ];

  const handleExportData = async () => {
    const data = await historyService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bis_sentinel_consumer_checks_${Date.now()}.json`;
    a.click();
    setExportNotice('Local checks & evidence exported to JSON.');
    setTimeout(() => setExportNotice(''), 4000);
  };

  const handleClearData = async () => {
    if (window.confirm('Clear all locally saved checks and offline cache?')) {
      await historyService.clearAll();
      setClearNotice('All local checks cleared from SQLite.');
      setTimeout(() => setClearNotice(''), 4000);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{t('profile.title')}</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Customize language, accessibility, and local SQLite data settings
        </p>
      </div>

      {exportNotice && (
        <div className="bg-teal-50 border-2 border-teal-200 text-teal-900 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {clearNotice && (
        <div className="bg-amber-50 border-2 border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{clearNotice}</span>
        </div>
      )}

      {/* Language Selector Bubble List */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
          <Globe className="w-4 h-4 text-indigo-700" />
          <span>{t('profile.language')}</span>
        </div>

        <div className="space-y-2">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-xs font-bold cursor-pointer active:scale-95 ${
                selectedLang === l.code
                  ? 'bg-indigo-50 border-indigo-700 text-indigo-950 shadow-sm ring-2 ring-indigo-500/30'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{l.name}</span>
              {selectedLang === l.code && <CheckCircle2 className="w-4 h-4 text-indigo-700" />}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility: Text Scaling & High Contrast */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
          <Type className="w-4 h-4 text-indigo-700" />
          <span>Accessibility & Text Comfort</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>{t('profile.textSize')}</span>
            <span className="font-mono text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
              {Math.round(fontScale * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="1.75"
            step="0.05"
            value={fontScale}
            onChange={(e) => setFontScale(parseFloat(e.target.value))}
            className="w-full accent-indigo-900 cursor-pointer h-2.5 bg-slate-200 rounded-lg"
          />
        </div>

        {/* High Contrast Toggle Bubble */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900">
              {t('profile.highContrast')}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Enhance contrast for bright sunlight
            </div>
          </div>
          <button
            onClick={toggleHighContrast}
            className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer active:scale-95 shadow-inner ${
              highContrast ? 'bg-indigo-900' : 'bg-slate-200'
            }`}
          >
            <span
              className={`block w-6 h-6 bg-white rounded-full shadow-md transition-transform transform absolute top-1 left-1 ${
                highContrast ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* AI Assistant & Gemini Configuration Status */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Sentinel Sahayak AI Engine</span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Active Engine:</span>
            <span className="font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
              {apiKeyPresent ? 'Google Gemini 1.5 Flash' : 'Civic Knowledge Base'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Database:</span>
            <span className="font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full font-mono">
              SQLite 3 (bis_sentinel.db)
            </span>
          </div>
        </div>
      </div>

      {/* Data Management: Export & Delete */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
          <Lock className="w-4 h-4 text-indigo-700" />
          <span>Local Storage & SQLite Data</span>
        </div>

        <div className="space-y-2 pt-1">
          <Button
            onClick={handleExportData}
            variant="secondary"
            className="w-full text-xs"
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>{t('profile.exportData')}</span>
          </Button>

          <Button
            onClick={handleClearData}
            variant="ghost"
            className="w-full text-xs text-rose-700 hover:bg-rose-50 hover:text-rose-900"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            <span>{t('profile.clearData')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
