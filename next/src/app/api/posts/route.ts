import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
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

    return NextResponse.json({ posts: postsWithLikes });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
