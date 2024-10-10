import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    backend: {
      loadPath: '/auth/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: 'it',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    ns: ['common'],
    detection: {
      order: ['querystring', 'sessionStorage'],
      lookupQuerystring: 'lang',
      lookupSessionStorage: 'lang',
    },
  });

export default i18next;
