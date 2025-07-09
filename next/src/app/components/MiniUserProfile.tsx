'use Client'
import Image from 'next/image';
import type { UserProfile } from '@prisma/client';

// import the userprofile from neon db and pass it as argument to fetch the data in db based on the current user login detail.
export default function MiniUserProfile({ profile }: { profile: UserProfile }) {
  return (
    <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-full">
      <Image
        src={profile.profileImage || "globe.svg"}
        alt="Avatar"
        width={30}
        height={30}
        className="rounded-full"
      />
      <span className="text-sm font-medium">{profile.username}</span>
    </div>
  );
}