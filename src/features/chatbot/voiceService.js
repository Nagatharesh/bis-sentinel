// Web Speech API wrapper for Speech-to-Text and Text-to-Speech

const LANG_LOCALE_MAP = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
};

class VoiceService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.initRecognition();
  }

  initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  isSpeechRecognitionSupported() {
    return !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));
  }

  isSpeechSynthesisSupported() {
    return !!(typeof window !== 'undefined' && window.speechSynthesis);
  }

  startListening({ language = 'en', onResult, onError, onEnd }) {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        if (onError) onError('Speech recognition is not supported in this browser.');
        return;
      }
    }

    try {
      this.recognition.lang = LANG_LOCALE_MAP[language] || 'en-IN';
      this.isListening = true;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        if (onResult) onResult(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        console.warn('Speech recognition error:', event.error);
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      console.warn('Recognition start error:', err);
      if (onError) onError(err.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
    }
    this.isListening = false;
  }

  speak({ text, language = 'en', onEnd }) {
    if (!this.synth) return;

    try {
      this.synth.cancel(); // Stop any active speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANG_LOCALE_MAP[language] || 'en-IN';
      utterance.rate = 0.95; // slightly deliberate for clarity
      utterance.pitch = 1.0;

      // Try selecting an appropriate Indian voice if available
      const voices = this.synth.getVoices();
      const targetLocale = LANG_LOCALE_MAP[language] || 'en-IN';
      const matchingVoice = voices.find((v) => v.lang === targetLocale || v.lang.startsWith(language));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        console.warn('TTS error:', err);
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Error in speak:', err);
      if (onEnd) onEnd();
    }
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const voiceService = new VoiceService();
