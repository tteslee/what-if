
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import UserMenu from '../src/components/UserMenu';
import { TranslationProvider } from '../src/contexts/TranslationContext';
import LanguageSwitcher from '../src/components/LanguageSwitcher';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'What-if: A digital testbed for urban innovation',
  description: 'Simulate urban interventions before real-world pilots or workshops. Ask "What if we..." and explore the possibilities.',
};
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TranslationProvider>
          {/* Navigation Header */}
          <nav className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">W</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900">What-if</span>
                </Link>
                
                <div className="flex items-center space-x-6">
                  <Link 
                    href="/scenarios/new" 
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    New Scenario
                  </Link>
                  <Link 
                    href="/scenarios/public" 
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Public Scenarios
                  </Link>
                  <Link 
                    href="/scenarios/my" 
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    My Scenarios
                  </Link>
                  <LanguageSwitcher />
                  <UserMenu />
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>{children}</main>
        </TranslationProvider>
        <Analytics />
      </body>
    </html>
  );
}
