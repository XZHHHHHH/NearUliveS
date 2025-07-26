'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@prisma/client';

export default function TestMultiUserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    // Optionally, refresh the page or redirect
    router.refresh();
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Multi-User Login Test</h1>
      <p style={{ marginBottom: '2rem', color: '#555' }}>
        Use this page to verify that different users can be logged in simultaneously in separate browser sessions (e.g., a normal window and an incognito window).
      </p>
      <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Current Session Status</h2>
        {loading ? (
          <p>Loading user status...</p>
        ) : user ? (
          <div>
            <p style={{ fontSize: '1.2rem', color: 'green' }}>
              Logged in as: <strong>{user.email}</strong>
            </p>
            <p>(User ID: {user.id})</p>
            <button 
              onClick={handleLogout}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '1.2rem', color: 'red' }}>
              <strong>Not logged in.</strong>
            </p>
            <button 
              onClick={() => router.push('/login')}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Go to Login Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
