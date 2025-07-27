'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/userUtils';
import type { User } from '@prisma/client';

type UserWithProfile = User & {
  profile?: {
    username?: string;
    profileImage?: string;
    bio?: string;
  } | null;
};

export default function SettingsPage() {
  const router = useRouter();
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          const userProfile = data.user;
          setUser(userProfile);
          setUsername(userProfile.profile?.username || '');
          setBio(userProfile.profile?.bio || '');
          setImageError(false);
          
          if (userProfile.profile?.profileImage) {
            setPreviewUrl(getImageUrl(userProfile.profile.profileImage));
          }
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user?.id?.toString() || '');

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response.fileName);
            } else {
              reject(new Error(response.error || 'Upload failed'));
            }
          } catch (e) {
            reject(new Error('Invalid response from server'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', '/api/upload/profile-image');
      xhr.send(formData);
    });
  };

  const handleProfileUpdate = async () => {
    if (!user?.id) return;
    setIsUpdating(true);
    setError('');
    setUploadProgress(0);

    try {
      let profileImageFileName = user.profile?.profileImage;

      if (selectedFile) {
        profileImageFileName = await uploadImage(selectedFile);
      }

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          username: username.trim() || undefined,
          bio: bio.trim() || undefined,
          profileImage: profileImageFileName,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }



      setUser(data.user);
      setIsEditing(false);
      setSelectedFile(null);
      setUploadProgress(0);
      setImageError(false);

      if (data.user.profile?.profileImage) {
        setPreviewUrl(getImageUrl(data.user.profile.profileImage));
      }

      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { user: data.user }
      }));

    
      setError('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsUpdating(false);
      setUploadProgress(0);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Failed to logout', error);
    } finally {
      router.replace('/login');
    }
  };

  if (loading) {
    return (
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </main>
    );
  }

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
              {user && (
                <>
                  {!isEditing ? (
                    <>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="h-16 w-16 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600 overflow-hidden flex-shrink-0">
                          {user?.profile?.profileImage && !imageError ? (
                            <img 
                              src={getImageUrl(user.profile.profileImage)} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                              style={{ aspectRatio: '1/1' }}
                              onError={() => {
                                console.error('Error loading profile image');
                                setImageError(true);
                              }}
                            />
                          ) : (
                            <span className="text-xl font-semibold text-gray-600">
                              {user?.profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{user?.profile?.username || 'User'}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                          <p className="text-sm text-gray-500">{user?.profile?.bio || 'No bio yet'}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                      >
                        Edit Profile
                      </button>
                    </>
                  ) : (
                    <>
                      {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                          {error}
                        </div>
                      )}

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Image
                        </label>
                        
                        <div className="mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-20 w-20 rounded-full border-2 border-gray-300 bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {previewUrl ? (
                                <img 
                                  src={previewUrl} 
                                  alt="Profile Preview" 
                                  className="w-full h-full object-cover rounded-full"
                                  onError={() => {
                                    console.error('Error loading preview image');
                                    setPreviewUrl('');
                                  }}
                                />
                              ) : user?.profile?.profileImage && !selectedFile ? (
                                <img 
                                  src={getImageUrl(user.profile.profileImage)} 
                                  alt="Current Profile" 
                                  className="w-full h-full object-cover rounded-full"
                                  onError={() => {
                                    console.error('Error loading current profile image');
                                    setImageError(true);
                                  }}
                                />
                              ) : (
                                <span className="text-xl font-semibold text-gray-600">
                                  {username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {selectedFile ? 'New image selected' : (user?.profile?.profileImage ? 'Current profile image' : 'No profile image yet')}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {selectedFile && (
                            <p className="text-xs text-blue-600 mt-2 break-words leading-tight">
                              Selected: {selectedFile.name}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1 break-words">Max 5MB, JPG/PNG</p>
                        </div>
                        
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="mt-2">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your username"
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setSelectedFile(null);
                            setError('');
                            setUploadProgress(0);
                            setUsername(user?.profile?.username || '');
                            setBio(user?.profile?.bio || '');
                            if (user?.profile?.profileImage) {
                              setPreviewUrl(getImageUrl(user.profile.profileImage));
                            } else {
                              setPreviewUrl('');
                            }
                          }}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                          disabled={isUpdating}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProfileUpdate}
                          disabled={isUpdating}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
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
