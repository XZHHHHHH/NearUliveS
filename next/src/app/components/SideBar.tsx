'use client';
import Link from 'next/link';
import { FC } from 'react';

{/*font of the icon description*/}
const font = "text-l font-serif"
const iconSize = "text-xl"
{/*spacing between the icons*/}
const spacing = "flex items-center space-x-3.5 py-8 text-gray-700 hover:bg-gray-200 w-35" 

export const SideBar: FC = () => (
  <aside className="w-45 bg-slate-50 border-r-2 h-screen shadow-2xs border-gray-400 p-8">
    {/* side bar content*/}
    <nav className="space-y-7">
    
      {/*back to homepage*/}
      <Link href="/home" 
      className={`${spacing}`}>
        <span className={`${iconSize}`}>🏠</span>
        <span className={`${font}`}>Home</span>
      </Link>
      <Link href="/publish" 
      className={`${spacing}`}>
        <span className={`${iconSize}`}>➕</span>
        <span className={`${font}`}>Publish</span>
      </Link>
      <Link href="/notifications" 
      className={`${spacing}`}>
        <span className={`${iconSize}`}>🔔</span>
        <span className={`${font}`}>Notifications</span>
      </Link>
      <Link href="/chat" 
      className={`${spacing}`}>
        <span className={`${iconSize}`}>💬</span>
        <span className={`${font}`}>Chat</span>
      </Link>
      <Link href="/setting" 
      className={`${spacing}`}>
        <span className={`${iconSize}`}>⚙️</span>
        <span className={`${font}`}>Setting</span>
      </Link>
    </nav>
  </aside>
);
