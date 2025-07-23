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
