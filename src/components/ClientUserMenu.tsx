'use client';

import dynamic from 'next/dynamic';

// Dynamically import UserMenu to avoid SSR issues
const UserMenu = dynamic(() => import('./UserMenu'), {
  ssr: false,
  loading: () => (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
      Sign In
    </button>
  )
});

export default function ClientUserMenu() {
  return <UserMenu />;
}
