import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import { getLangCode, sanitizeString, setSessionLanguage, hashDetectorLookup } from '@pagopa-pn/pn-commons';
import I18nextBrowserLanguageDetector, { CustomDetector } from 'i18next-browser-languagedetector';

const languageDetector = new I18nextBrowserLanguageDetector();

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
    fallbackLng: 'it',
    debug: process.env.NODE_ENV === 'development',
    ns: ['common'],
    interpolation: {
      // the escape function is called only when we have a dynamic piece of string
      // i.e Hello my name is {{name}}
      // this customization is needed to fix pn-2838
      escape: (srt: string): string => sanitizeString(srt),
    },
    detection: {
      order: ['hashDetector', 'sessionStorage', 'navigator'],
      lookupSessionStorage: 'lang',
    },
  });

i18next.on('languageChanged', (language: string) => {
  const lang = getLangCode(language);
  setSessionLanguage(lang);
  document.documentElement.setAttribute('lang', lang);
});

export default i18next;