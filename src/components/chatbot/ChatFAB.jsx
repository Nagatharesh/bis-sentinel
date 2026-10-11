import React from 'react';
import { MessageSquare, Mic, Sparkles } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function ChatFAB() {
  const { t } = useTranslation();
  const isOpen = useChatStore((state) => state.isOpen);
  const toggleOpen = useChatStore((state) => state.toggleOpen);
  const isListening = useChatStore((state) => state.isListening);
  const isSpeaking = useChatStore((state) => state.isSpeaking);

  if (isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Soft bubble callout pill */}
      <div className="bg-indigo-950 text-white text-xs px-4 py-1.5 rounded-full shadow-lg backdrop-blur flex items-center gap-2 border border-indigo-700/60 font-bold animate-bounce hidden sm:flex">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>Ask Sentinel Sahayak</span>
      </div>

      {/* Big Tactile Bubble FAB Button */}
      <button
        onClick={toggleOpen}
        aria-label="Open Sentinel Sahayak Chatbot Assistant"
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center text-white shadow-float transition-all duration-200 relative group cursor-pointer active:scale-90 border-4 border-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400',
          isListening
            ? 'bg-rose-600 animate-pulse scale-110 ring-4 ring-rose-400'
            : isSpeaking
            ? 'bg-teal-700 animate-bounce ring-4 ring-teal-400'
            : 'bg-gradient-to-tr from-indigo-950 to-indigo-800 hover:scale-105 hover:shadow-2xl'
        )}
      >
        {isListening ? (
          <Mic className="w-7 h-7 animate-pulse text-white" />
        ) : (
          <MessageSquare className="w-7 h-7 text-white" />
        )}

        {/* Live indicator bubble badge */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 border-2 border-white rounded-full shadow-sm" />
      </button>
    </div>
  );
}
