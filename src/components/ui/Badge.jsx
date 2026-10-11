import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    supported: 'bg-teal-50 text-teal-800 border-teal-200',
    review: 'bg-amber-50 text-amber-800 border-amber-200',
    unknown: 'bg-slate-100 text-slate-700 border-slate-300',
    contradiction: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
