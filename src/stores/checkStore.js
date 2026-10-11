import { create } from 'zustand';
import { PRELOADED_SCENARIOS } from '../services/mockData';

export const useCheckStore = create((set, get) => ({
  activeCheck: PRELOADED_SCENARIOS[0],
  inputMethod: 'photo_scan', // 'photo_scan' | 'listing_url' | 'licence_manual'
  capturedPhotos: {
    front: null,
    mark: null,
    plate: null,
    box: null,
  },
  photoQuality: 85, // percentage
  listingUrl: '',
  manualLicence: '',
  analysisSteps: [
    { id: 'step1', status: 'pending' },
    { id: 'step2', status: 'pending' },
    { id: 'step3', status: 'pending' },
    { id: 'step4', status: 'pending' },
    { id: 'step5', status: 'pending' },
  ],
  offlineQueue: [],

  setActiveCheck: (check) => set({ activeCheck: check }),

  setInputMethod: (method) => set({ inputMethod: method }),

  setCapturedPhoto: (key, dataUri) =>
    set((state) => ({
      capturedPhotos: { ...state.capturedPhotos, [key]: dataUri },
    })),

  resetCapturedPhotos: () =>
    set({
      capturedPhotos: { front: null, mark: null, plate: null, box: null },
      photoQuality: 85,
    }),

  setPhotoQuality: (val) => set({ photoQuality: val }),
  setListingUrl: (url) => set({ listingUrl: url }),
  setManualLicence: (lic) => set({ manualLicence: lic }),

  setAnalysisStepStatus: (stepIndex, status) =>
    set((state) => {
      const nextSteps = [...state.analysisSteps];
      if (nextSteps[stepIndex]) {
        nextSteps[stepIndex] = { ...nextSteps[stepIndex], status };
      }
      return { analysisSteps: nextSteps };
    }),

  resetAnalysisSteps: () =>
    set({
      analysisSteps: [
        { id: 'step1', status: 'pending' },
        { id: 'step2', status: 'pending' },
        { id: 'step3', status: 'pending' },
        { id: 'step4', status: 'pending' },
        { id: 'step5', status: 'pending' },
      ],
    }),

  queueOfflineCheck: (payload) =>
    set((state) => ({
      offlineQueue: [...state.offlineQueue, { id: `offline-${Date.now()}`, timestamp: new Date().toISOString(), payload }],
    })),
}));
