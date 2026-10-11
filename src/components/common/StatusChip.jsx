import React from 'react';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DIMENSION_STATUS } from '../../services/mockData';

export function StatusChip({ status, label, onClick, isSelected, className }) {
  const isSupported = status === DIMENSION_STATUS.SUPPORTED || status === 'Supported';
  const isContradiction = status === DIMENSION_STATUS.CONTRADICTION || status === 'Contradiction';
  const isUnknown = status === DIMENSION_STATUS.UNKNOWN || status === 'Unknown';

  const colorStyles = isSupported
    ? 'bg-teal-50/90 text-teal-950 border-2 border-teal-300 hover:bg-teal-100 shadow-2xs'
    : isContradiction
    ? 'bg-rose-50/90 text-rose-950 border-2 border-rose-300 hover:bg-rose-100 shadow-2xs'
    : 'bg-slate-100/90 text-slate-800 border-2 border-slate-300 hover:bg-slate-200 shadow-2xs';

  const badgeStyles = isSupported
    ? 'bg-teal-700 text-white'
    : isContradiction
    ? 'bg-rose-700 text-white'
    : 'bg-slate-600 text-white';

  const activeRing = isSelected ? 'ring-4 ring-indigo-500/50 scale-[1.02] shadow-md border-indigo-600' : '';

  const Icon = isSupported ? CheckCircle2 : isContradiction ? XCircle : HelpCircle;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all duration-200 select-none min-h-[56px] w-full cursor-pointer active:scale-95 disabled:cursor-default',
        colorStyles,
        activeRing,
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="w-4 h-4 shrink-0" />
        <span className="font-extrabold text-xs sm:text-sm truncate text-slate-900">
          {label}
        </span>
      </div>

      <span className={cn('text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-2xs', badgeStyles)}>
        {status}
      </span>
    </button>
  );
}
