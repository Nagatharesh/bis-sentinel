import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, type = 'text', error, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition text-base disabled:opacity-50 disabled:bg-slate-50',
        error && 'border-rose-400 focus:ring-rose-500',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
