import React from 'react';
import { WifiOff, Clock } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useCheckStore } from '../../stores/checkStore';

export function OfflineBanner() {
  const isOffline = useAppStore((state) => state.isOffline);
  const queueCount = useCheckStore((state) => state.offlineQueue.length);

  if (!isOffline) return null;

  return (
    <div className="bg-slate-900 text-white px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between shadow-md sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Working offline. Checks use cached registry or queue for later.</span>
      </div>
      {queueCount > 0 && (
        <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-semibold text-xs">
          <Clock className="w-3 h-3" />
          {queueCount} queued
        </span>
      )}
    </div>
  );
}
