import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import login from './it/login.json';

const resources = {
  it: {
    login,
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
