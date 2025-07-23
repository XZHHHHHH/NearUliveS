'use client'
import Image from 'next/image';
import type { UserProfile } from '@prisma/client';
import { getImageUrl } from '@/lib/userUtils';

// import the userprofile from neon db and pass it as argument to fetch the data in db based on the current user login detail.
export default function MiniUserProfile({ profile }: { profile: UserProfile }) {
  return (
    <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-3 rounded-full transition-all duration-200 hover:shadow-md">
      <div className="relative w-10 h-10">
        <Image
          src={getImageUrl(profile.profileImage)}
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full border-2 border-gray-300 object-cover w-full h-full shadow-sm"
        />
      </div>
      <span className="text-sm font-medium text-gray-800 hidden sm:inline-block">
        {profile.username || "User"}
      </span>
    </div>
  );
}