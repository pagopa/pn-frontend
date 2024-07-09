import * as yup from 'yup';

import { LangCode } from '@pagopa/mui-italia';

export const LANGUAGE_SESSION_KEY = 'lang';

export const getSessionLanguage = (): LangCode => {
  const lang = (sessionStorage.getItem(LANGUAGE_SESSION_KEY) ?? 'it') as LangCode;
  const validLang = validateLanguage(lang);

  return (validLang ?? 'it') as LangCode;
};

export const setSessionLanguage = (lang: LangCode) => {
  sessionStorage.setItem(LANGUAGE_SESSION_KEY, lang);
};

const validateLanguage = (lang: LangCode): LangCode | boolean => {
  try {
    yup.string().oneOf(['it', 'en', 'de', 'fr', 'sl']).validateSync(lang);

    return lang;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(error);
    }
    return false;
  }
};
