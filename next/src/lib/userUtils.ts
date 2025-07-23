// src/lib/userUtils.ts
import type { User, UserProfile } from '@prisma/client';

export type UserWithProfile = User & {
  profile: UserProfile | null;
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

/**
 * Gets the display username for a user
 */
export function getDisplayUsername(user: UserWithProfile): string {
  return user.profile?.username || `Nuser${user.id}`;
}

/**
 * Gets the profile image for a user
 */
export function getProfileImage(user: UserWithProfile): string {
  return user.profile?.profileImage || '/globe.svg';
}

/**
 * Gets the first letter for avatar display
 */
export function getAvatarLetter(user: UserWithProfile): string {
  const username = getDisplayUsername(user);
  return username.charAt(0).toUpperCase();
}

/**
 * Gets the proper image URL for display
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '/globe.svg';
  
  // If it's a Base64 string (data URL), return it directly
  if (imagePath.startsWith('data:image/')) {
    return imagePath;
  }
  
  // If it's already a full URL, use it directly
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it already starts with /, use it directly
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Handle relative paths that might already include uploads/profiles
  if (imagePath.includes('uploads/profiles/')) {
    return `/${imagePath}`;
  }
  
  // Otherwise, assume it's a filename and construct the path
  return `/uploads/profiles/${imagePath}`;
}
