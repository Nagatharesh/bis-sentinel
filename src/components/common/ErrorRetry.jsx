import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function ErrorRetry({ title = 'Unable to complete check', message, onRetry }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center max-w-md mx-auto my-6 shadow-subtle">
      <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-2 mb-5 leading-relaxed">
        {message || 'The registry query encountered a temporary connection glitch. Your progress is saved.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" className="w-full sm:w-auto">
          <RefreshCw className="w-4 h-4 mr-1.5" />
          Retry Check
        </Button>
      )}
    </div>
  );
}
