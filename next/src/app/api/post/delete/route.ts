import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    const { postId } = await request.json();
    
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

    // Check if the post exists and if the user is the author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.authorId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized. You can only delete your own posts.' }, { status: 403 });
    }

    // Delete related records first (comments, likes) then the post
    await prisma.$transaction([
      // Delete all comments on this post
      prisma.comment.deleteMany({
        where: { postId: postId }
      }),
      // Delete all likes on this post
      prisma.like.deleteMany({
        where: { postId: postId }
      }),
      // Delete the post itself
      prisma.post.delete({
        where: { id: postId }
      })
    ]);

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
