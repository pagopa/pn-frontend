import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import { sanitizeString } from '@pagopa-pn/pn-commons';

void i18next
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    lng: 'it',
    fallbackLng: 'it',
    debug: process.env.NODE_ENV === 'development',
    ns: ['common'],
    interpolation: {
      escape: (srt: string): string => sanitizeString(srt)
    }
  });

export default i18next;
