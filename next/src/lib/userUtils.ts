// src/lib/userUtils.ts
import type { User, UserProfile } from '@prisma/client';

export type UserWithProfile = User & {
  profile: UserProfile | null;
};

export type UserWithBasicProfile = User & { 
  profile?: { 
    username?: string; 
    bio?: string; 
    profileImage?: string; 
  } | null 
};

export type SafeUser = {
  id: number;
  username: string;
  profileImage: string;
};

/**
 * Transforms a user with profile to a safe user object with default values
 * - Default username: Nuser{id} (e.g., Nuser1, Nuser2)
 * - Default profile image: /globe.svg
 * - Removes sensitive data like email and password
 */
export function transformUserToSafe(user: UserWithProfile): SafeUser {
  if (!user) {
    throw new Error('User is required');
  }

  return {
    id: user.id,
    username: user.profile?.username || `Nuser${user.id}`,
    profileImage: user.profile?.profileImage || '/globe.svg'
  };
}

export function getDisplayUsername(user: UserWithProfile | UserWithBasicProfile): string {
  return user.profile?.username || `Nuser${user.id}`;
}

export function getProfileImage(user: UserWithProfile | UserWithBasicProfile): string {
  return getImageUrl(user.profile?.profileImage);
}

export function getAvatarLetter(user: UserWithProfile | UserWithBasicProfile): string {
  const username = getDisplayUsername(user);
  return username.charAt(0).toUpperCase();
}

export function getUserDisplayData(user: UserWithProfile | UserWithBasicProfile) {
  return {
    username: user.profile?.username || `Nuser${user.id}`,
    profileImage: getImageUrl(user.profile?.profileImage),
    avatarLetter: (user.profile?.username || `Nuser${user.id}`).charAt(0).toUpperCase(),
    bio: user.profile?.bio || null
  };
}

export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '/globe.svg';
  
  if (imagePath.startsWith('data:image/')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  if (imagePath.includes('uploads/profiles/')) {
    return `/${imagePath}`;
  }
  
  return `/uploads/profiles/${imagePath}`;
}
