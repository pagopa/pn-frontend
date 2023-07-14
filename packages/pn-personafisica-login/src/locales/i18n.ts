import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import loginIt from './it/login.json';
import loginEn from './en/login.json';
import loginFr from './fr/login.json';
import loginDe from './de/login.json';
import loginSl from './sl/login.json';

const resources = {
  it: {
    login: loginIt,
  },
  en: {
    login: loginEn,
  },
  fr: {
    login: loginFr,
  },
  de: {
    login: loginDe,
  },
  sl: {
    login: loginSl,
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
