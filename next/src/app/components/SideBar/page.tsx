'use client';

import Link from 'next/link';
import { FC } from 'react';

const font = "text-xl font-serif"
const iconSize = "text-6xl"
const spacing = "flex items-center space-x-10 py-4 text-gray-700 hover:bg-gray-200" 

export const SideBar: FC = () => (
  <aside className="w-80 bg-slate-50 border-r-2 h-screen shadow-2xs
  border-gray-400 p-10">
    {/* side*/}
    <nav className="space-y-4">
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
