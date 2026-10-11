import React from 'react';
import { Link } from 'react-router-dom';
import { AppLogo } from '../common/AppLogo';
import { Wifi, WifiOff } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

export function Header() {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const isOffline = useAppStore((state) => state.isOffline);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'hi', label: 'हिंदी' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-subtle">
      <div className="max-w-md lg:max-w-5xl mx-auto px-4 h-18 flex items-center justify-between">
        {/* Clear, easy to understand Logo */}
        <Link to="/" className="group cursor-pointer">
          <AppLogo size="default" />
        </Link>

        {/* Right side: bubble language switcher & network indicator */}
        <div className="flex items-center gap-2">
          {/* Offline indicator bubble */}
          <div
            className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border shadow-2xs',
              isOffline
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-teal-50 text-teal-800 border-teal-200'
            )}
            title={isOffline ? 'Working Offline' : 'Online'}
          >
            {isOffline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            )}
            <span className="hidden sm:inline font-semibold">
              {isOffline ? 'Offline' : 'Online'}
            </span>
          </div>

          {/* Language selector bubble container */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 shadow-2xs">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={cn(
                  'px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer active:scale-95',
                  language === l.code
                    ? 'bg-indigo-900 text-white shadow-sm ring-1 ring-indigo-900'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
