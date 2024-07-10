import * as yup from 'yup';

export const LANGUAGE_SESSION_KEY = 'lang';

export const getSessionLanguage = (): string => {
  const lang = sessionStorage.getItem(LANGUAGE_SESSION_KEY) ?? 'it';
  return validateLanguage(lang);
};

export const setSessionLanguage = (lang: string) => {
  sessionStorage.setItem(LANGUAGE_SESSION_KEY, lang);
};

const validateLanguage = (lang: string): string => {
  try {
    yup.string().oneOf(['it', 'en', 'de', 'fr', 'sl']).validateSync(lang);

    return lang;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(error);
    }
    return 'it';
  }
};
