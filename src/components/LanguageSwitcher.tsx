'use client';

import { useTranslation } from '../contexts/TranslationContext';
import { useWhatIfStore } from '../lib/store';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const { clearData } = useWhatIfStore();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => {
          clearData();
          setLanguage('en');
        }}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => {
          clearData();
          setLanguage('ko');
        }}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          language === 'ko'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        한국어
      </button>
    </div>
  );
}
