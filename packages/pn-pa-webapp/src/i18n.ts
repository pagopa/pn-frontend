import i18next from 'i18next';
import LanguageDetector, { CustomDetector } from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { sanitizeString, setSessionLanguage } from '@pagopa-pn/pn-commons';

const languageDetector = new LanguageDetector();

const customHashDetector: CustomDetector = {
  name: 'customHashDetector',
  lookup() {
    const hash = window.location.hash;
    const lang = hash.match(/lang=([a-z]{2})/);
    console.log('customHashDetector', lang);
    return lang ? lang[1] : undefined;
  },
};

languageDetector.addDetector(customHashDetector);

void i18next
  .use(languageDetector)
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    lng: 'it',
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
      order: ['customHashDetector', 'sessionStorage'],
      lookupQuerystring: 'lang',
      lookupSessionStorage: 'lang',
    },
  })
  .then(async () => {
    await i18next.changeLanguage();
    setSessionLanguage(i18next.language);
  })
  .catch((err: any) => {
    throw new Error(err);
  });

export default i18next;
