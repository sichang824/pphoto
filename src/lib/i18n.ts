'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/common.json';
import zhCommon from '../locales/zh/common.json';

// Try to get the stored language preference
let storedLanguage = 'en';
if (typeof window !== 'undefined') {
  try {
    const languageStorage = localStorage.getItem('language-storage');
    if (languageStorage) {
      const parsed = JSON.parse(languageStorage);
      if (parsed.state && parsed.state.language) {
        storedLanguage = parsed.state.language;
      }
    }
  } catch (error) {
    console.error('Error reading language from localStorage', error);
  }
}

// 防止在服务器端多次初始化
const isInitialized = i18n.isInitialized;

if (!isInitialized) {
  const resources = {
    en: {
      common: enCommon
    },
    zh: {
      common: zhCommon
    }
  };

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: storedLanguage, // 使用存储的语言或默认为英文
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false // 不转义HTML
      },
      defaultNS: 'common'
    });
}

export default i18n;
