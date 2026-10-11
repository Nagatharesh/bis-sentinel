import React from 'react';
import { CheckCircle2, Loader2, Minus, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StepTracker({ steps, currentStepIndex }) {
  return (
    <div className="space-y-3.5 my-4">
      {steps.map((step, idx) => {
        let status = 'pending';
        if (idx < currentStepIndex) status = 'completed';
        else if (idx === currentStepIndex) status = 'in_progress';
        if (step.status) status = step.status; // override if specific

        const isCompleted = status === 'completed';
        const isInProgress = status === 'in_progress';
        const isSkipped = status === 'skipped';
        const isFailed = status === 'failed';

        return (
          <div
            key={step.id || idx}
            className={cn(
              'flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-200',
              isInProgress && 'bg-indigo-50/70 border-indigo-200 shadow-sm',
              isCompleted && 'bg-white border-slate-200',
              isSkipped && 'bg-slate-50 border-slate-100 opacity-60',
              isFailed && 'bg-rose-50/60 border-rose-200',
              status === 'pending' && 'bg-white/50 border-slate-100 opacity-50'
            )}
          >
            <div className="mt-0.5 shrink-0">
              {isCompleted ? (
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : isInProgress ? (
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center animate-spin">
                  <Loader2 className="w-4 h-4" />
                </div>
              ) : isSkipped ? (
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                  <Minus className="w-3.5 h-3.5" />
                </div>
              ) : isFailed ? (
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 text-slate-400 flex items-center justify-center text-xs font-semibold">
                  {idx + 1}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4
                  className={cn(
                    'text-sm font-semibold',
                    isInProgress ? 'text-indigo-950 font-bold' : 'text-slate-800'
                  )}
                >
                  {step.title}
                </h4>
                <span className="text-xs font-medium">
                  {isCompleted && <span className="text-teal-700">Done</span>}
                  {isInProgress && <span className="text-indigo-700 animate-pulse">Running</span>}
                  {isSkipped && <span className="text-slate-400">Skipped</span>}
                  {isFailed && <span className="text-rose-700">Unavailable</span>}
                </span>
              </div>
              {step.detail && (
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {step.detail}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
