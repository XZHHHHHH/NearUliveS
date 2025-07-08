import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import NavBar from '../components/NavBar';
import {SideBar} from '../components/SideBar';
const prisma = new PrismaClient();

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("userEmail")?.value;
  let profile = null;

  if (userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        profile: true,
      },
    });
    profile = user?.profile || null;
  }

  return (
    <div>
      <header className="fixed w-full flex flex-col">
        <NavBar profile={profile} />
      </header>
      <div className="flex flex-row h-screen bg-yellow-50">
        <aside className="fixed top-30 w-60">
          {/* Side bar here */}
          <SideBar />
        </aside>
        <main className="ml-45 mt-30 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}