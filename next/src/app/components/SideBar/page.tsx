'use client';

import Link from 'next/link';
import { FC } from 'react';

{/*font of the icon description*/}
const font = "text-xl font-serif"
const iconSize = "text-xl"
{/*spacing between the icons*/}
const spacing = "flex items-center space-x-10 py-4 text-gray-700 hover:bg-gray-200 w-50" 

export const SideBar: FC = () => (
  <aside className="w-60 bg-slate-50 border-r-2 h-screen shadow-2xs border-gray-400 p-8">
    {/* side bar content*/}
    <nav className="space-y-10">
    
      {/*back to homepage*/}
      <Link href="/home" 
      className={`${spacing}`}>
        <span className={`${iconSize}`}>🏠</span>
        <span className={`${font}`}>Home</span>
      </Link>
      <Link href="/home" 
      className={`${spacing}`}>
        <span className={`${iconSize}`}>➕</span>
        <span className={`${font}`}>Create</span>
      </Link>
      <Link href="/home" 
      className={`${spacing}`}>
        <span className={`${iconSize}`}>🔔</span>
        <span className={`${font}`}>Notifications</span>
      </Link>
      <Link href="/home" 
      className={`${spacing}`}>
        <span className={`${iconSize}`}>💬</span>
        <span className={`${font}`}>Chat</span>
      </Link>
    </nav>
  </aside>
);
