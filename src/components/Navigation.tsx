'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const { t, isClient } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/scenarios/new" 
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                {isClient ? t.nav.newScenario : 'New Scenario'}
              </Link>
              <Link 
                href="/scenarios/public" 
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                {isClient ? t.nav.publicScenarios : 'Public Scenarios'}
              </Link>
              <Link 
                href="/scenarios/my" 
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                {isClient ? t.nav.myScenarios : 'My Scenarios'}
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <LanguageSwitcher />
            <UserMenu />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 bg-slate-50">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/scenarios/new" 
                className="text-slate-600 hover:text-slate-900 transition-colors px-4 py-3 rounded-md hover:bg-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isClient ? t.nav.newScenario : 'New Scenario'}
              </Link>
              <Link 
                href="/scenarios/public" 
                className="text-slate-600 hover:text-slate-900 transition-colors px-4 py-3 rounded-md hover:bg-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isClient ? t.nav.publicScenarios : 'Public Scenarios'}
              </Link>
              <Link 
                href="/scenarios/my" 
                className="text-slate-600 hover:text-slate-900 transition-colors px-4 py-3 rounded-md hover:bg-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isClient ? t.nav.myScenarios : 'My Scenarios'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
