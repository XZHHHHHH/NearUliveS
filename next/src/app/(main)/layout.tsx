import '../globals.css';
import { ReactNode } from 'react';
import NavBar from '../components/NavBar/page';
import { SideBar } from '../components/SideBar/page';

export default function RootLayout({children}: {children: ReactNode}) {
  return (
      <body>
        {/* NavBar at the top*/}
        <NavBar />

        {/* section for side bar & other dynamic page contents
        (e.g home and notifications*/}
        <div className="flex flex-row bg-yellow-50">

          {/* Side bar at the left*/}
          <SideBar />

          {/* Dynamic page contents:
          specific syntax: {children} indicates the page content*/}
          <main className="p-6">{children}</main>
        </div>
      </body>
  );
}
