'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';
import { useTranslation } from '../contexts/TranslationContext';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onAuthSuccess?: () => void;
}

export default function AuthGuard({ children, fallback, onAuthSuccess }: AuthGuardProps) {
  const { t, isClient } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('AuthGuard - Initial session check:', {
        hasSession: !!session,
        user: session?.user ? { id: session.user.id, email: session.user.email } : null,
        error
      });
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthGuard - Auth state change:', {
          event,
          hasSession: !!session,
          user: session?.user ? { id: session.user.id, email: session.user.email } : null
        });
        setUser(session?.user ?? null);
        setLoading(false);
        
        // If user just signed in and we have a callback, call it
        if (event === 'SIGNED_IN' && onAuthSuccess) {
          onAuthSuccess();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-slate-600">{isClient ? t.auth.loading : 'Loading...'}</div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="p-6 text-center">
        <div className="mb-6">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          {isClient ? t.auth.signInRequired : 'Sign In Required'}
        </h3>
        <p className="text-slate-600 mb-6">
          {isClient ? t.auth.signInToCreateContent : 'You need to sign in to create custom cities and interventions.'}
        </p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          {isClient ? t.auth.signIn : 'Sign In'}
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  return <>{children}</>;
}
