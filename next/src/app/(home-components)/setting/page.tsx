'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@prisma/client';

type UserWithProfile = User & {
  profile?: {
    username?: string;
    profileImage?: string;
  } | null;
};

export default function SettingsPage() {
  const router = useRouter();
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUsername(parsedUser.profile?.username || '');
      setProfileImage(parsedUser.profile?.profileImage || '');
    } else {
      router.replace('/login');
    }
  }, [router]);

  const handleProfileUpdate = async () => {
    if (!user?.id) return;
    setIsUpdating(true);
    setError('');

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: username.trim() || undefined,
          profileImage: profileImage.trim() || undefined,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update local storage and state with new user data
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.replace('/login');
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold">Settings</h1>

      <ul className="space-y-4">

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
              <div className="flex items-center space-x-4 mb-4">
                {!isEditing ? (
                  <>
                    <div className="h-16 w-16 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600 overflow-hidden">
                      {user?.profile?.profileImage ? (
                        <img 
                          src={user.profile.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{user?.profile?.username || 'User'}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Image URL
                      </label>
                      <input
                        type="text"
                        id="profileImage"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setUsername(user?.profile?.username || '');
                        setProfileImage(user?.profile?.profileImage || '');
                        setError('');
                      }}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleProfileUpdate}
                      disabled={isUpdating}
                      className={`px-3 py-1 text-sm text-white rounded-md ${
                        isUpdating
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          )}
        </li>

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
