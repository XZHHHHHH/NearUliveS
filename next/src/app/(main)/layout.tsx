import '../globals.css';
import { ReactNode } from 'react';
import NavBar from '../components/NavBar/page';
import { SideBar } from '../components/SideBar/page';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        {/* 1️⃣ Fixed top nav */}
        <NavBar />

        {/* 2️⃣ Below the nav, horizontal split: sidebar + page content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left column: your sidebar */}
          <SideBar />

          {/* Right column: whatever page is active */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
