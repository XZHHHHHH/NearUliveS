import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params
  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
    include: { 
      author: { 
        select: { 
          id: true,
          profile: { 
            select: { 
              username: true,
              profileImage: true 
            } 
          } 
        } 
      } 
    },
    orderBy: { createdAt: 'asc' }
  })
  return NextResponse.json(comments)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params
  const { content } = await req.json()
  
  // Get user from cookies
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('userEmail')?.value;

  if (!userEmail) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  // Get the user ID from email
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: {
      postId: Number(postId),
      content,
      authorId: user.id
    },
    include: { 
      author: { 
        select: { 
          id: true,
          profile: { 
            select: { 
              username: true,
              profileImage: true 
            } 
          } 
        } 
      } 
    }
  })

  // Get the post to find the author
  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
    select: { authorId: true }
  });

  // Create notification for the post author (only if it's not the user commenting on their own post)
  if (post && post.authorId !== user.id) {
    try {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: 'comment',
          postId: Number(postId),
          fromUserId: user.id,
          message: `${user.email} commented on your post`,
        } as any, // Temporary type assertion until Prisma types are updated
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Don't fail the comment operation if notification fails
    }
  }

  return NextResponse.json(comment, { status: 201 })
}