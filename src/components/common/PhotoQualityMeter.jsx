import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function PhotoQualityMeter({ quality = 85, className }) {
  const { t } = useTranslation();

  const isGood = quality >= 75;
  const isModerate = quality >= 50 && quality < 75;

  const barColor = isGood ? 'bg-teal-600' : isModerate ? 'bg-amber-500' : 'bg-rose-500';
  const label = isGood
    ? t('capture.promptGood')
    : isModerate
    ? t('capture.promptMoveCloser')
    : t('capture.promptReduceGlare');

  return (
    <div className={cn('bg-white/95 backdrop-blur rounded-xl p-3 border border-slate-200 shadow-sm', className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
          {t('capture.qualityMeter')}
        </span>
        <span className={isGood ? 'text-teal-700' : isModerate ? 'text-amber-700' : 'text-rose-700'}>
          {quality}% Clarity
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300 rounded-full', barColor)}
          style={{ width: `${quality}%` }}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
        {isGood ? (
          <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        )}
        <span>{label}</span>
      </p>
    </div>
  );
}
