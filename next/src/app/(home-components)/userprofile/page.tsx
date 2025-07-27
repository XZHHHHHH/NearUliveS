import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import FullUserProfile from '../../components/FullUserProfile'; 

const prisma = new PrismaClient();

export default async function UserProfilePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ userId?: string }> 
}) {
  const params = await searchParams;
  const userId = params.userId;
  
  const cookieStore = await cookies(); 
  const userEmail = cookieStore.get("userEmail")?.value;

  if (!userEmail) return <p>Not logged in</p>;

  let user;
  
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { 
        posts: {
          include: {
            Like: true }
        }, 
        profile: true 
      },
    });
  } else {
    user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { 
        posts: {
          include: {
            Like: true
          }
        }, 
        profile: true 
      },
    });
  }

  if (!user || !user.profile) return <p>User profile not found.</p>;

  return <FullUserProfile profile={user.profile} posts={user.posts} />;
}
