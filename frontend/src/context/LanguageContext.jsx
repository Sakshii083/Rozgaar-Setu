import { createContext, useContext, useEffect, useState } from "react";

import en from "../translations/en";
import hi from "../translations/hi";
import kn from "../translations/kn";
import mr from "../translations/mr";
import te from "../translations/te";

const translations = {
  en,
  hi,
  kn,
  mr,
  te,
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const t = (key) => {
    const keys = key.split(".");

    let value = translations[language];

    for (const part of keys) {
      value = value?.[part];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}