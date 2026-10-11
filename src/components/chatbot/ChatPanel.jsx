import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useAppStore } from '../../stores/appStore';
import { geminiService } from '../../services/geminiService';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function ChatPanel() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const isOpen = useChatStore((state) => state.isOpen);
  const setIsOpen = useChatStore((state) => state.setIsOpen);
  const messages = useChatStore((state) => state.messages);
  const isLoading = useChatStore((state) => state.isLoading);
  const isListening = useChatStore((state) => state.isListening);
  const isSpeaking = useChatStore((state) => state.isSpeaking);
  const ttsEnabled = useChatStore((state) => state.ttsEnabled);
  const setTtsEnabled = useChatStore((state) => state.setTtsEnabled);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const startVoiceInput = useChatStore((state) => state.startVoiceInput);
  const stopVoiceInput = useChatStore((state) => state.stopVoiceInput);
  const clearHistory = useChatStore((state) => state.clearHistory);

  const currentLang = useAppStore((state) => state.language);
  const quickReplies = geminiService.getQuickReplies(currentLang);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;
    sendMessage(text, currentLang);
    setInputText('');
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput(currentLang, (transcript) => {
        setInputText(transcript);
        handleSend(transcript);
      });
    }
  };

  return (
    <>
      {/* Dimmed backdrop - click anywhere outside to cancel */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-label="Cancel and close chat overlay"
      />

      {/* Bottom-right docked Chatbot Card */}
      <div
        role="dialog"
        aria-label="Sentinel Sahayak Assistant"
        className="fixed right-3 bottom-22 sm:right-6 sm:bottom-6 z-50 flex flex-col w-[calc(100vw-24px)] sm:w-[420px] max-w-[440px] h-[78vh] sm:h-[620px] max-h-[640px] bg-white rounded-3xl shadow-2xl border-2 border-indigo-950/20 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
      >
        {/* Header with High-Visibility Cancel Button */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-800 text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-700/60 border border-indigo-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base leading-tight truncate">
                  Sentinel Sahayak
                </h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full border border-teal-500/30 font-semibold shrink-0">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-indigo-200 mt-0.5 truncate">
                {currentLang === 'ta' ? 'தமிழ் • English • हिंदी' : currentLang === 'hi' ? 'हिंदी • English • தமிழ்' : 'English • Tamil • Hindi'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Audio Voice Readout toggle */}
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition cursor-pointer text-indigo-200"
              title={ttsEnabled ? 'Disable Voice Readout' : 'Enable Voice Readout'}
            >
              {ttsEnabled ? (
                <Volume2 className={cn('w-4 h-4', isSpeaking ? 'text-teal-300 animate-pulse' : 'text-indigo-200')} />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Clear history */}
            <button
              onClick={clearHistory}
              className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition cursor-pointer text-indigo-200"
              title="Clear History"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* PROMINENT BUBBLE CANCEL BUTTON */}
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold flex items-center gap-1 transition shadow-sm border border-rose-400/50 cursor-pointer ml-1"
              title="Cancel and close chatbot"
              aria-label="Cancel chatbot"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
              <span>Cancel</span>
            </button>
          </div>
        </div>

      {/* Voice Status banner if listening */}
      {isListening && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 flex items-center justify-between text-xs text-rose-800 animate-pulse">
          <span className="flex items-center gap-2 font-medium">
            <Mic className="w-4 h-4 text-rose-600 animate-spin" />
            {t('chatbot.listening')} ({currentLang.toUpperCase()})
          </span>
          <button
            onClick={stopVoiceInput}
            className="text-xs underline font-semibold text-rose-900"
          >
            Stop
          </button>
        </div>
      )}

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-surface-50">
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 text-xs text-indigo-900 leading-relaxed flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Civic Verification Assistant</p>
            <p className="text-slate-600 mt-0.5">
              I can explain mark claims, licence numbers, and report procedures in plain language.
            </p>
          </div>
        </div>

        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2.5 max-w-[90%]',
                isBot ? 'mr-auto items-start' : 'ml-auto flex-row-reverse items-end'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-sm',
                  isBot
                    ? 'bg-indigo-900 text-white'
                    : 'bg-teal-700 text-white'
                )}
              >
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={cn(
                  'p-3.5 rounded-2xl text-sm leading-relaxed shadow-subtle',
                  isBot
                    ? 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-sm'
                    : 'bg-indigo-900 text-white rounded-br-sm'
                )}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={cn(
                    'text-[10px] mt-1.5 font-medium flex items-center justify-between gap-2',
                    isBot ? 'text-slate-400' : 'text-indigo-200'
                  )}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isBot && msg.source === 'gemini' && (
                    <span className="text-[9px] text-indigo-600 font-semibold bg-indigo-50 px-1 rounded">
                      Gemini
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2 mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-indigo-900 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-1.5 shadow-subtle">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Replies & Cancel Pill */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full border border-rose-200 transition shrink-0 whitespace-nowrap font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
          title="Cancel and close chat"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Cancel Chat</span>
        </button>
        {quickReplies.map((qr, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qr.query)}
            className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 transition shrink-0 whitespace-nowrap font-medium cursor-pointer"
          >
            {qr.label}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center transition border shrink-0 cursor-pointer',
              isListening
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 border-slate-200'
            )}
            title={isListening ? 'Stop listening' : 'Speak your query'}
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('chatbot.placeholder')}
            className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 rounded-xl bg-indigo-900 hover:bg-indigo-800 disabled:opacity-40 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </>
);
}
