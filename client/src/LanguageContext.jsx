import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("truck_expense_language") || "en",
  );

  useEffect(() => {
    localStorage.setItem("truck_expense_language", language);
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
