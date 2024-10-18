import { setSessionLanguage, getLangCode, hashDetectorLookup } from '@pagopa-pn/pn-commons';
import i18next from 'i18next';
import LanguageDetector, { CustomDetector } from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const languageDetector = new LanguageDetector();

const customHashDetector: CustomDetector = {
  name: 'hashDetector',
  lookup: hashDetectorLookup,
};

languageDetector.addDetector(customHashDetector);

void i18next
  .use(languageDetector)
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
      order: ['hashDetector', 'sessionStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupSessionStorage: 'lang',
    },
  });

i18next.on('languageChanged', (language: string) => {
  const lang = getLangCode(language);
  setSessionLanguage(lang);
  document.documentElement.setAttribute('lang', lang);
});

export default i18next;