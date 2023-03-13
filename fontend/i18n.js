import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../src/locales/en/translation.json';
import fi from '../src/locales/fi/translation.json';

import Backend from 'i18next-xhr-backend';
const resources = {
  en: {
    translation: en,
  },
  fi: {
    translation: fi,
  },
};
i18n
  .use(initReactI18next)

  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // connect with React
  .use(LanguageDetector)

  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    resources,
    lng: '',
    fallbackLng: 'en',
    whitelist: ['en', 'fi'],
    nonExplicitWhitelist: true,
    load: 'languageOnly',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    saveMissing: true,
    saveMissingTo: 'all',

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
