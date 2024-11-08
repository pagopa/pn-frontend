import * as yup from 'yup';

import { LangCode } from '@pagopa/mui-italia';

export const LANGUAGE_SESSION_KEY = 'lang';

export const getSessionLanguage = (): string => {
  const lang = sessionStorage.getItem(LANGUAGE_SESSION_KEY);
  return lang ?? 'it';
};

export const setSessionLanguage = (lang: LangCode) => {
  sessionStorage.setItem(LANGUAGE_SESSION_KEY, lang);
};

/** Get the LangCode from generic language string */
export const getLangCode = (language?: string): LangCode => {
  try {
    const lang = (language || '').substring(0, 2);

    yup.string().oneOf(['it', 'en', 'de', 'fr', 'sl']).validateSync(lang);

    return lang as LangCode;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(error);
    }
    return 'it';
  }
};

/** Lookup function for detect lang from hash */
export const hashDetectorLookup = () => {
  const hash = window.location.hash;
  const lang = hash.match(/lang=([a-z]{2})/);
  return lang ? lang[1] : undefined;
};
