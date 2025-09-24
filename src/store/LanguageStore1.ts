'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/lib/i18n';

type Language = 'en' | 'zh';

// Get the current i18n language or default to 'zh'
const getInitialLanguage = (): Language => {
  // Try to get the stored language from localStorage first
  if (typeof window !== 'undefined') {
    try {
      const languageStorage = localStorage.getItem('language-storage');
      if (languageStorage) {
        const parsed = JSON.parse(languageStorage);
        if (parsed.state && parsed.state.language) {
          return parsed.state.language as Language;
        }
      }
    } catch (error) {
      console.error('Error reading language from localStorage', error);
    }
  }
  
  // Fallback to current i18n language or 'zh'
  return (i18n.language as Language) || 'zh';
};

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: getInitialLanguage(),
      setLanguage: (lang: Language) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    {
      name: 'language-storage',
      // Make sure we hydrate the store as soon as possible
      skipHydration: false,
    }
  )
);
