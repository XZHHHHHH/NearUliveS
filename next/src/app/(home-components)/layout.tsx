import '../globals.css';
import { ReactNode } from 'react';
import NavBar from '../components/NavBar/page';
import { SideBar } from '../components/SideBar/page';

export default function RootLayout({children}: {children: ReactNode}) {
  return (
      <body>
        <header className="fixed w-full flex flex-col">
          {/* NavBar at the top*/}
          <NavBar />
        </header>
          {/* section for side bar & other dynamic page contents
          (e.g home and notifications*/}
        <div className="flex flex-row h-screen bg-yellow-50">
          <aside className="fixed top-30 w-60">
            {/* Side bar at the left*/}
            <SideBar />
          </aside>

          {/* Dynamic page contents:
          specific syntax: {children} indicates the page content*/}
          <main className="ml-60 mt-30 flex-1 overflow-y-auto">{children}
          </main>
        </div>
      </body>
  );
}
