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
