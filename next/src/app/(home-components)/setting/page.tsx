'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@prisma/client';

type UserWithProfile = User & {
  profile?: { username?: string } | null;
};

export default function SettingsPage() {
  const router = useRouter();
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [user, setUser] = useState<UserWithProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.replace('/login');
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold">Settings</h1>

      <ul className="space-y-4">
        {/* ── Account Information ───────────────────────────────────────── */}
        <li>
          <button
            type="button"
            onClick={() => setShowAccountInfo(!showAccountInfo)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-4 shadow hover:bg-gray-50 transition"
          >
            <span className="font-medium text-gray-900">Account Information</span>
            <span className="text-xl">{showAccountInfo ? '▲' : '▼'}</span>
          </button>

          {showAccountInfo && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-800 shadow-inner">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                  {user?.profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{user?.profile?.username || 'User'}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </li>

        {/* ── Log out ──────────────────────────────────────────────────── */}
        <li>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-lg border border-red-300 bg-red-50 p-4 shadow hover:bg-red-100 transition"
          >
            <span className="font-medium text-red-700">Log out</span>
            <span className="text-xl">🚪</span>
          </button>
        </li>
      </ul>
    </main>
  );
}
