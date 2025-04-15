'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/common.json';
import zhCommon from '../locales/zh/common.json';

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
      lng: 'en', // 默认语言
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false // 不转义HTML
      },
      defaultNS: 'common'
    });
}

export default i18n; 