import React from 'react';
import { cn } from '../../lib/utils';

export function AppLogo({ size = 'default', showText = true, className }) {
  const sizeMap = {
    sm: { icon: 'w-9 h-9', svg: 'w-6 h-6', text: 'text-sm', sub: 'text-[10px]' },
    default: { icon: 'w-11 h-11', svg: 'w-7 h-7', text: 'text-base sm:text-lg', sub: 'text-[11px]' },
    lg: { icon: 'w-16 h-16', svg: 'w-10 h-10', text: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 'w-20 h-20', svg: 'w-12 h-12', text: 'text-3xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size] || sizeMap.default;

  return (
    <div className={cn('flex items-center gap-3 select-none', className)}>
      {/* Tactile Bubble Badge Icon */}
      <div
        className={cn(
          'rounded-2xl sm:rounded-3xl bg-gradient-to-b from-indigo-800 to-indigo-950 p-1 flex items-center justify-center shrink-0 shadow-md ring-2 ring-indigo-500/30 transition-transform active:scale-95 relative overflow-hidden',
          currentSize.icon
        )}
      >
        {/* Soft top-gloss highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl pointer-events-none" />

        <img
          src="/assets/bis_logo.svg"
          alt="Bureau of Indian Standards"
          className={cn('relative z-10 object-contain filter drop-shadow-sm', currentSize.svg)}
          onError={(e) => {
            e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Bureau_of_Indian_Standards_Logo.svg';
          }}
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <h1 className={cn('font-extrabold text-slate-900 tracking-tight', currentSize.text)}>
              BIS Sentinel
            </h1>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-teal-200">
              Verify
            </span>
          </div>
          <p className={cn('text-slate-500 font-medium', currentSize.sub)}>
            Consumer Standard Mark Checker
          </p>
        </div>
      )}
    </div>
  );
}
