'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ×
        </button>
        
        <div className="p-6">
          {isLogin ? (
            <LoginForm 
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
              onSwitchToSignup={() => setIsLogin(false)}
            />
          ) : (
            <SignupForm 
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
