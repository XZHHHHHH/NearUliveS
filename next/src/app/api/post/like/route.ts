import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();

    const cookieStore = await cookies();
    const userEmail = cookieStore.get("userEmail")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already liked this post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: parseInt(postId),
        userId: user.id
      }
    });

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      
      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { postId: parseInt(postId) }
      });

      return NextResponse.json({ 
        success: true, 
        liked: false, 
        likeCount 
      });
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          postId: parseInt(postId),
          userId: user.id
        }
      });

      // Get the post to find the author
      const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
        select: { authorId: true }
      });

      // Create notification for the post author (only if it's not the user liking their own post)
      if (post && post.authorId !== user.id) {
        try {
          console.log('Creating like notification:', {
            userId: post.authorId,
            type: 'like',
            postId: parseInt(postId),
            fromUserId: user.id,
            message: `${user.email} liked your post`,
          });
          
          const notification = await prisma.notification.create({
            data: {
              userId: post.authorId,
              type: 'like',
              postId: parseInt(postId),
              fromUserId: user.id,
              message: `${user.email} liked your post`,
            } as any, // Temporary type assertion until Prisma types are updated
          });
          
          console.log('Notification created successfully:', notification);
        } catch (notificationError) {
          console.error('Failed to create notification:', notificationError);
          // Don't fail the like operation if notification fails
        }
      } else {
        console.log('No notification created:', {
          postExists: !!post,
          postAuthorId: post?.authorId,
          currentUserId: user.id,
          isOwnPost: post?.authorId === user.id
        });
      }
      
      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { postId: parseInt(postId) }
      });

      return NextResponse.json({ 
        success: true, 
        liked: true, 
        likeCount 
      });
    }
  } catch (err) {
    console.error("POST /api/post/like failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
