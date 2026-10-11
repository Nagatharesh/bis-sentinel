import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-indigo-900 text-white hover:bg-indigo-800 active:bg-indigo-950 shadow-md hover:shadow-lg active:scale-95 border-2 border-indigo-700/50',
      secondary:
        'bg-white text-indigo-950 border-2 border-slate-200 hover:bg-slate-50 active:bg-slate-100 shadow-sm active:scale-95 hover:border-slate-300',
      outline:
        'bg-indigo-50/60 text-indigo-900 border-2 border-indigo-300 hover:bg-indigo-100 active:bg-indigo-200 active:scale-95',
      ghost:
        'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 active:scale-95',
      teal:
        'bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900 shadow-md hover:shadow-lg active:scale-95 border-2 border-teal-600/50',
      danger:
        'bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900 shadow-md hover:shadow-lg active:scale-95 border-2 border-rose-600/50',
      bubbleShutter:
        'w-20 h-20 rounded-full bg-white border-4 border-indigo-900 shadow-float active:scale-90 flex items-center justify-center ring-4 ring-indigo-200 hover:ring-indigo-300 transition-all duration-200',
    };

    const sizes = {
      sm: 'min-h-[42px] px-4 py-2 text-xs rounded-full font-semibold',
      default: 'min-h-[50px] px-6 py-3 text-sm sm:text-base rounded-full font-bold tracking-tight',
      lg: 'min-h-[56px] px-8 py-3.5 text-base sm:text-lg rounded-full font-bold shadow-lg',
      icon: 'w-12 h-12 rounded-full flex items-center justify-center p-0 shadow-sm',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variants[variant],
          variant !== 'bubbleShutter' && sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
