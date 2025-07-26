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
  
  //Use await in order to wait for the cookies() to return the promise before applying get() on it
  const cookieStore = await cookies(); 
  const userEmail = cookieStore.get("userEmail")?.value;

  // not useremail found, then shown login failure message
  if (!userEmail) return <p>Not logged in</p>;

  let user;
  
  if (userId) {
    // Show specific user's profile
    user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { 
        posts: {
          include: {
            Like: true // Include likes for each post
          }
        }, 
        profile: true 
      },
    });
  } else {
    // Show current logged-in user's profile
    user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { 
        posts: {
          include: {
            Like: true // Include likes for each post
          }
        }, 
        profile: true 
      },
    });
  }

  if (!user || !user.profile) return <p>User profile not found.</p>;

  return <FullUserProfile profile={user.profile} posts={user.posts} />;
}
