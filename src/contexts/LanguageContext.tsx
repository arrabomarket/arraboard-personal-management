import React, { createContext, useContext, useState, useEffect } from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const translations: Record<string, Record<string, string>> = {
  "overview": {
    "hu": "Áttekintés",
    "en": "Overview"
  },
  "tasks": {
    "hu": "Tennivalók",
    "en": "Tasks"
  },
  "notes": {
    "hu": "Jegyzetek",
    "en": "Notes"
  },
  "finance": {
    "hu": "Pénzügyek",
    "en": "Finance"
  },
  "projects": {
    "hu": "Projektek",
    "en": "Projects"
  },
  "contacts": {
    "hu": "Kapcsolatok",
    "en": "Contacts"
  },
  "links": {
    "hu": "Linkek",
    "en": "Links"
  },
  "calendar": {
    "hu": "Naptár",
    "en": "Calendar"
  },
  "passwords": {
    "hu": "Jelszókezelő",
    "en": "Password Manager"
  },
  "settings": {
    "hu": "Beállítások",
    "en": "Settings"
  },
  "logout": {
    "hu": "Kijelentkezés",
    "en": "Logout"
  },
  // ... add more translations as needed
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState(() => 
    localStorage.getItem("language") || "hu"
  );

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}