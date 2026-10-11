import { create } from 'zustand';
import { geminiService } from '../services/geminiService';
import { voiceService } from '../features/chatbot/voiceService';

export const useChatStore = create((set, get) => ({
  isOpen: false,
  isListening: false,
  isSpeaking: false,
  ttsEnabled: true,
  isLoading: false,
  messages: [
    {
      id: 'msg-init',
      sender: 'bot',
      text: geminiService.getGreeting('en'),
      timestamp: new Date().toISOString(),
      source: 'system',
    },
  ],

  setIsOpen: (isOpen) => {
    if (!isOpen) {
      voiceService.stopListening();
      voiceService.stopSpeaking();
      set({ isListening: false, isSpeaking: false });
    }
    set({ isOpen });
  },

  toggleOpen: () => {
    const next = !get().isOpen;
    get().setIsOpen(next);
  },

  setTtsEnabled: (ttsEnabled) => {
    if (!ttsEnabled) {
      voiceService.stopSpeaking();
      set({ isSpeaking: false });
    }
    set({ ttsEnabled });
  },

  startVoiceInput: (language = 'en', onSpeechCaptured) => {
    if (get().isListening) {
      voiceService.stopListening();
      set({ isListening: false });
      return;
    }

    voiceService.stopSpeaking();
    set({ isListening: true, isSpeaking: false });

    voiceService.startListening({
      language,
      onResult: (transcript) => {
        set({ isListening: false });
        if (onSpeechCaptured) {
          onSpeechCaptured(transcript);
        } else {
          get().sendMessage(transcript, language);
        }
      },
      onError: (err) => {
        console.warn('Voice recognition error:', err);
        set({ isListening: false });
      },
      onEnd: () => {
        set({ isListening: false });
      },
    });
  },

  stopVoiceInput: () => {
    voiceService.stopListening();
    set({ isListening: false });
  },

  sendMessage: async (text, language = 'en', currentContext = null) => {
    if (!text || !text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isLoading: true,
    }));

    try {
      const response = await geminiService.sendMessage({
        message: text,
        language,
        currentContext,
      });

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toISOString(),
        source: response.source,
      };

      set((state) => ({
        messages: [...state.messages, botMsg],
        isLoading: false,
      }));

      // Speak text aloud if TTS enabled
      if (get().ttsEnabled && response.text) {
        set({ isSpeaking: true });
        voiceService.speak({
          text: response.text,
          language,
          onEnd: () => set({ isSpeaking: false }),
        });
      }
    } catch (err) {
      console.error('Failed to get bot response:', err);
      const fallbackMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'I could not reach the network right now, but you can continue checking items locally.',
        timestamp: new Date().toISOString(),
      };
      set((state) => ({
        messages: [...state.messages, fallbackMsg],
        isLoading: false,
      }));
    }
  },

  clearHistory: () => {
    set({
      messages: [
        {
          id: `init-${Date.now()}`,
          sender: 'bot',
          text: geminiService.getGreeting('en'),
          timestamp: new Date().toISOString(),
        },
      ],
    });
  },
}));
