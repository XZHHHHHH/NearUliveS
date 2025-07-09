import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import FullUserProfile from '../../components/FullUserProfile'; 

const prisma = new PrismaClient();

export default async function UserProfilePage() {
  //Use await in order to wait for the cookies() to return the promise before applying get() on it
  const cookieStore = await cookies(); 
  const userEmail = cookieStore.get("userEmail")?.value;

  // not useremail found, then shown login failure message
  if (!userEmail) return <p>Not logged in</p>;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { posts: true, profile: true },
  });

  if (!user || !user.profile) return <p>User profile not found.</p>;

  return <FullUserProfile profile={user.profile} posts={user.posts} />;
}
