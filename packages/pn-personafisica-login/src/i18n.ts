import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

void i18next
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    backend: {
      loadPath: '/auth/locales/{{lng}}/{{ns}}.json',
    },
    lng: 'it',
    fallbackLng: 'it',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    ns: ['common'],
  })
  .catch((err: any) => {
    throw new Error(err);
  });

export default i18next;
