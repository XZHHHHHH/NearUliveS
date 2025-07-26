import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import PostDetailClient from '../../components/PostDetailClient';

const prisma = new PrismaClient();

export default async function PostDetail({ params }) {
  // Await the params before accessing its properties
  const { id } = await params;
  
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('userEmail')?.value;
  
  // Get current user for like checking
  const currentUser = userEmail ? await prisma.user.findUnique({
    where: { email: userEmail }
  }) : null;
  
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        include: { profile: true }
      },
      Like: {
        select: {
          userId: true
        }
      }
    },
  });

  if (!post) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Post not found.</p>
      </div>
    );
  }

  const likeCount = post.Like.length;
  const isLikedByUser = currentUser ? post.Like.some(like => like.userId === currentUser.id) : false;

  // Transform the post data to match the client component interface
  const postData = {
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt.toISOString(),
    author: {
      id: post.author.id,
      email: post.author.email,
      profile: post.author.profile
    }
  };

  return (
    <PostDetailClient 
      post={postData}
      currentUser={currentUser}
      likeCount={likeCount}
      isLikedByUser={isLikedByUser}
    />
  );
}