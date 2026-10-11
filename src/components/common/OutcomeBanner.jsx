import React from 'react';
import { ShieldCheck, AlertCircle, HelpCircle, Leaf, ExternalLink } from 'lucide-react';
import { OUTCOME_TYPES } from '../../services/mockData';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function OutcomeBanner({ outcome, className }) {
  const { t } = useTranslation();

  let config = {
    bg: 'bg-teal-50 border-teal-300 text-teal-900',
    iconColor: 'text-teal-700',
    iconBg: 'bg-teal-100',
    Icon: ShieldCheck,
    text: OUTCOME_TYPES.NO_MISMATCH,
  };

  if (outcome === OUTCOME_TYPES.INCONSISTENCY) {
    config = {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-100',
      Icon: AlertCircle,
      text: OUTCOME_TYPES.INCONSISTENCY,
    };
  } else if (outcome === OUTCOME_TYPES.UNABLE_TO_VERIFY) {
    config = {
      bg: 'bg-slate-50 border-slate-300 text-slate-800',
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-200',
      Icon: HelpCircle,
      text: OUTCOME_TYPES.UNABLE_TO_VERIFY,
    };
  } else if (outcome === OUTCOME_TYPES.ECO_SEPARATE) {
    config = {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      Icon: Leaf,
      text: OUTCOME_TYPES.ECO_SEPARATE,
    };
  }

  const { bg, iconColor, iconBg, Icon, text } = config;

  return (
    <div className={cn('p-4 sm:p-5 rounded-2xl border shadow-subtle', bg, className)}>
      <div className="flex items-start gap-3.5">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5', iconBg)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider font-bold opacity-75">
            Verification Result
          </p>
          <h2 className="text-lg sm:text-xl font-bold leading-snug mt-0.5">
            {text}
          </h2>
          <p className="text-xs sm:text-sm mt-2 text-slate-600 font-medium flex items-center gap-1.5">
            <span>⚖️ {t('disclaimer')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
