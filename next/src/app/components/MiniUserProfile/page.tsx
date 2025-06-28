import Image from 'next/image';
import type { UserProfile } from '@prisma/client';

export default function MiniUserProfile({ profile }: { profile: UserProfile }) {
  return (
    <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-full">
      <Image
        src={profile.profileImage || "/swimming pool.png"}
        alt="Avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
      <span className="text-sm font-medium">@{profile.username}</span>
    </div>
  );
}