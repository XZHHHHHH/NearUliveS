import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

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
          await prisma.notification.create({
            data: {
              userId: post.authorId,
              type: 'like',
              postId: parseInt(postId),
              fromUserId: user.id,
              message: `${user.email} liked your post`,
            } as any, // Temporary type assertion until Prisma types are updated
          });
        } catch (notificationError) {
          console.error('Failed to create notification:', notificationError);
          // Don't fail the like operation if notification fails
        }
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
