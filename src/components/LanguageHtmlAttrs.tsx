'use client';

import { useLanguageStore } from '@/store/languageStore';
import { ReactNode, useEffect, useState } from 'react';

export default function LanguageHtmlAttrs({ children }: { children: ReactNode }) {
  const { language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During server rendering and initial client rendering, use a default
  if (!mounted) {
    return <html lang="en">{children}</html>;
  }

  return <html lang={language}>{children}</html>;
}
