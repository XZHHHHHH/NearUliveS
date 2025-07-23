'use client'

import Image from 'next/image';
import Link from 'next/link';
import MiniUserProfile from './MiniUserProfile';
import SearchBar from './SearchBar';
import type { UserProfile } from '@prisma/client';

export default function NavBar({ profile }: { profile: UserProfile | null }) {
  const pill = "flex items-center h-8 rounded-full p-6";
  
  // Debug: Check if profile is being passed
  console.log('NavBar profile:', profile);
  
  return (
    <header className="relative flex w-full h-30 bg-slate-50 shadow-xl p-4 items-center gap-4">

      <Link href="/home" className={`${pill} flex-shrink-0 bg-yellow-100`}>
        <Image src="/app_logo.svg" alt="AppLogo" width={200} height={100} />
      </Link>

      <div className="flex-1 min-w-[200px] max-w-[600px] mx-auto">
        <SearchBar/>
      </div>

      <div className="flex-shrink-0">
        {profile ? (
          <Link href="/userprofile">
            <MiniUserProfile profile={profile} />
          </Link>
        ) : (
          <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}