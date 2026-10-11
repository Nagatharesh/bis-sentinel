import { create } from 'zustand';
import i18n from '../i18n';

export const useAppStore = create((set, get) => ({
  language: localStorage.getItem('i18nextLng') || 'en',
  hasCompletedOnboarding: localStorage.getItem('bis_onboarded') === 'true',
  isOffline: !navigator.onLine,
  highContrast: localStorage.getItem('bis_high_contrast') === 'true',
  fontScale: parseFloat(localStorage.getItem('bis_font_scale') || '1'),
  consentShareContact: localStorage.getItem('bis_consent_contact') === 'true',

  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    set({ language: lang });
  },

  setOnboardingCompleted: (val = true) => {
    localStorage.setItem('bis_onboarded', val ? 'true' : 'false');
    set({ hasCompletedOnboarding: val });
  },

  setOffline: (isOffline) => set({ isOffline }),

  toggleHighContrast: () => {
    const nextVal = !get().highContrast;
    localStorage.setItem('bis_high_contrast', nextVal ? 'true' : 'false');
    if (nextVal) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    set({ highContrast: nextVal });
  },

  setFontScale: (scale) => {
    localStorage.setItem('bis_font_scale', String(scale));
    document.documentElement.style.setProperty('--font-scale', String(scale));
    set({ fontScale: scale });
  },

  setConsentShareContact: (val) => {
    localStorage.setItem('bis_consent_contact', val ? 'true' : 'false');
    set({ consentShareContact: val });
  },
}));

// Set initial high contrast and font scale on document
if (typeof window !== 'undefined') {
  if (localStorage.getItem('bis_high_contrast') === 'true') {
    document.documentElement.classList.add('high-contrast');
  }
  const savedScale = localStorage.getItem('bis_font_scale');
  if (savedScale) {
    document.documentElement.style.setProperty('--font-scale', savedScale);
  }
  window.addEventListener('online', () => useAppStore.getState().setOffline(false));
  window.addEventListener('offline', () => useAppStore.getState().setOffline(true));
}
