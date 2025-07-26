'use client'

import Image from 'next/image';
import Link from 'next/link';
import MiniUserProfile from './MiniUserProfile';
import SearchBar from './SearchBar';
import { useNotificationCounts } from '../../hooks/useNotifications';
import type { UserProfile } from '@prisma/client';

export default function NavBar({ profile }: { profile: UserProfile | null }) {
  const pill = "flex items-center h-8 rounded-full p-6";
  const { counts } = useNotificationCounts();
  
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

      {/* Notification Bell */}
      {profile && (
        <div className="flex-shrink-0 mr-4">
          <Link href="/notifications" className="relative">
            <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              {/* Bell Icon with Ring Animation */}
              <svg 
                className={`w-6 h-6 transition-all duration-300 ${
                  counts.all > 0 
                    ? 'text-orange-500 bell-ring bell-glow' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                fill={counts.all > 0 ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={counts.all > 0 ? 1.5 : 2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
            </div>
          </Link>
        </div>
      )}

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