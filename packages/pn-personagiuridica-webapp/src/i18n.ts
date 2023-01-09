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

    // variant inspired in https://stackoverflow.com/questions/58269428/i18next-react-trans-component-escaping-characters-correctly
    // is the version present in pf-login
    // interpolation: { escapeValue: false },  
    
    // variant copied from pa-webapp
    interpolation: {
      escape: (srt: string): string => sanitizeString(srt)
    }
  });

export default i18next;
