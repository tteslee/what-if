'use client';

import Link from 'next/link';
import { useTranslation } from '../contexts/TranslationContext';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const { t } = useTranslation();

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-slate-900">{t.main.title}</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/scenarios/new" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t.nav.newScenario}
            </Link>
            <Link 
              href="/scenarios/public" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t.nav.publicScenarios}
            </Link>
            <Link 
              href="/scenarios/my" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t.nav.myScenarios}
            </Link>
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
