"use client";

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useLanguageStore } from '@/store/LanguageStore1';

export default function Providers({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { language } = useLanguageStore();

  // Ensure the language is set correctly after hydration
  useEffect(() => {
    if (language && language !== i18n.language) {
      i18n.changeLanguage(language);
    }
    setIsHydrated(true);
  }, [language]);

  // Optional: You can add a loading state to prevent content flash
  if (!isHydrated) {
    return <div className="min-h-screen flex items-center justify-center">
      {/* You can add a spinner or loading indicator here if needed */}
    </div>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
