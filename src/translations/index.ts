import { en } from './en';
import { ko } from './ko';

export type Language = 'en' | 'ko';
export type TranslationKeys = typeof en;

export const translations = {
  en,
  ko,
};

export const getTranslation = (language: Language): TranslationKeys => {
  return translations[language] || translations.en;
};
