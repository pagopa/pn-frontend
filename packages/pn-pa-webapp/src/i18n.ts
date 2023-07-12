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
      // the escape function is called only when we have a dynamic piece of string
      // i.e Hello my name is {{name}}
      // this customization is needed to fix pn-2838
      escape: (srt: string): string => sanitizeString(srt),
    },
  });

export default i18next;
