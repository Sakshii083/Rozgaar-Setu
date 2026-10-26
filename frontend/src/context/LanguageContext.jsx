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
    () => localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const t = (key, fallback = null) => {
    if (!key || typeof key !== "string") return fallback || "";
    const keys = key.split(".");

    // 1. Try current language
    let value = translations[language];
    for (const part of keys) {
      if (value === undefined || value === null) {
        value = undefined;
        break;
      }
      value = value[part];
    }

    if (value !== undefined && value !== null && typeof value === "string") {
      return value;
    }

    // 2. Fallback to English dictionary
    if (language !== "en") {
      let enValue = translations["en"];
      for (const part of keys) {
        if (enValue === undefined || enValue === null) {
          enValue = undefined;
          break;
        }
        enValue = enValue[part];
      }
      if (enValue !== undefined && enValue !== null && typeof enValue === "string") {
        return enValue;
      }
    }

    // 3. Fallback parameter, or original key
    return fallback !== null && fallback !== undefined ? fallback : key;
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
