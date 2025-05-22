import { initReactI18next } from 'react-i18next';
import { createCookie } from 'react-router';
import { unstable_createI18nextMiddleware } from 'remix-i18next/middleware';
import en from '../../public/locales/en/common.json';
import es from '../../public/locales/es/common.json';

export const localeCookie = createCookie('en_lang', {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
});

export const [i18nextMiddleware, getLocale, getInstance] =
  unstable_createI18nextMiddleware({
    detection: {
      supportedLanguages: ['en', 'fr', 'es'],
      fallbackLanguage: 'en',
      cookie: localeCookie,
    },
    i18next: {
      resources: { en: { translation: en },fr: { translation: es }, es: { translation: es } },
    },
    plugins: [initReactI18next],
  });

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en;
    };
  }
}
