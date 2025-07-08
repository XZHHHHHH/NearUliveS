'use client'

import Image from 'next/image';
import MiniUserProfile from 'app/components/MiniUserProfile';
import SearchBar from 'app/components/SearchBar';
import type { UserProfile } from '@prisma/client';

export default function NavBar({ profile }: { profile: UserProfile | null }) {
  const pill = "flex items-center h-8 rounded-full p-6";
  return (
    <header className="relative flex w-full h-30 bg-slate-50 shadow-xl p-4 justify-between items-center">
      <div className={`${pill} flex-shrink-0 bg-yellow-100`}>
        <Image src="/app_logo.svg" alt="AppLogo" width={200} height={100} />
      </div>
          <SearchBar/>
           {profile && (
        <a href="/userprofile">
          <MiniUserProfile profile={profile} />
        </a>
      )}
    </header>
  );
}