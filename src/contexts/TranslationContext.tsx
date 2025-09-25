'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getTranslation, TranslationKeys } from '../translations';

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationKeys;
  isClient: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  // Always start with 'en' to prevent hydration mismatch
  const [language, setLanguage] = useState<Language>('en');
  const [isClient, setIsClient] = useState(false);

  // Load language preference from localStorage on mount (for SSR compatibility)
  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ko')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when changed
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('language', language);
    }
  }, [language, isClient]);

  const t = getTranslation(language);

  const value = {
    language,
    setLanguage,
    t,
    isClient,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
