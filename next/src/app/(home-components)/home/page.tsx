import PostCard from "@/app/components/PostCard";
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

// 1. homepage handles postgird UI and data fecting 
// 2. while postcard.tsx handles the UI rendering(if data fetching inside postcard, will cause)
export default async function HomePage() {
  const prisma = new PrismaClient();
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('userEmail')?.value;
  
  // Get current user for like checking
  const currentUser = userEmail ? await prisma.user.findUnique({
    where: { email: userEmail }
  }) : null;

  const posts = await prisma.post.findMany({
    include: {
      author: {
        include: {
          profile: true,
        }
      },
      Like: {
        select: {
          userId: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Process posts to include like information
  const postsWithLikes = posts.map(post => ({
    ...post,
    likeCount: post.Like.length,
    isLikedByUser: currentUser ? post.Like.some(like => like.userId === currentUser.id) : false
  }));

  return (
    <main>
      {/*grid-layout and auto adjust the postcard size while its clickable area is fixed with its size */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 p-8">
        {postsWithLikes.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            userprofile={post.author.profile!}
            likeCount={post.likeCount}
            isLikedByUser={post.isLikedByUser}
          />
        ))}
      </div>
    </main>
  );
}
