
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TranslationProvider } from '../src/contexts/TranslationContext';
import Navigation from '../src/components/Navigation';

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
          <Navigation />
          <main>{children}</main>
        </TranslationProvider>
        <Analytics />
      </body>
    </html>
  );
}
