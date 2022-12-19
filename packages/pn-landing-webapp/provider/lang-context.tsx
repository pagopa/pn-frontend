import { createContext, FC, ReactNode, useEffect, useState } from "react";

export type LangCode = "de" | "en" | "fr" | "it" | "sl";

const LS_LANG_PROP_NAME = "pagopaLanguage";
const DEFAULT_LANG: LangCode = "it";

interface ILangContext {
  selectedLanguage: LangCode;
  changeLanguage: (lang: LangCode) => void;
}

// const LangContext = createContext<ILangContext | undefined>(undefined);
const LangContext = createContext<ILangContext>({
  selectedLanguage: DEFAULT_LANG,
  changeLanguage: (lang: LangCode) => {},
});

export const LangProvider: FC<ReactNode> = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState<LangCode>(DEFAULT_LANG);

  const changeLanguageHandler = (newLang: LangCode) => {
    localStorage.setItem(LS_LANG_PROP_NAME, newLang as string);
    setSelectedLang(() => newLang as LangCode);
  };

  useEffect(() => {
    const selectedLang = localStorage.getItem(LS_LANG_PROP_NAME);
    if (selectedLang) {
      setSelectedLang(() => selectedLang as LangCode);
    }
  }, []);

  return (
    <LangContext.Provider
      value={{
        selectedLanguage: selectedLang,
        changeLanguage: changeLanguageHandler,
      }}
    >
      {children}
    </LangContext.Provider>
  );
};

export default LangContext;
