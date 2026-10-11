import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction }) {
  return (
    <div className="text-center py-12 px-4 bg-white/60 rounded-2xl border border-dashed border-slate-200">
      <div className="w-14 h-14 bg-indigo-50 text-indigo-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
