'use client';

import { useTranslation } from '../contexts/TranslationContext';
import { useWhatIfStore } from '../lib/store';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const { clearData } = useWhatIfStore();

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => {
          clearData();
          setLanguage('en');
        }}
        className={`px-2 py-1 text-xs rounded transition-colors ${
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
        className={`px-2 py-1 text-xs rounded transition-colors ${
          language === 'ko'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        KO
      </button>
    </div>
  );
}
