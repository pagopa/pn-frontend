import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import loginIt from './it/login.json';
import loginEn from './en/login.json';
import loginFr from './fr/login.json';
import loginDe from './de/login.json';
import loginSl from './sl/login.json';

import commonIt from './it/common.json';
import commonEn from './en/common.json';
import commonFr from './fr/common.json';
import commonDe from './de/common.json';
import commonSl from './sl/common.json';

const resources = {
  it: {
    login: loginIt,
    common: commonIt,
  },
  en: {
    login: loginEn,
    common: commonEn,
  },
  fr: {
    login: loginFr,
    common: commonFr,
  },
  de: {
    login: loginDe,
    common: commonDe,
  },
  sl: {
    login: loginSl,
    common: commonSl,
  },
};

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'it',
    fallbackLng: 'it',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    ns: ['login'],
  })
  .catch((err: any) => {
    throw new Error(err);
  });

export default i18n;
