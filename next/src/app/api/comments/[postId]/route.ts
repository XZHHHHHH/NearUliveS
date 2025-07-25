import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient()

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
  return NextResponse.json(comment, { status: 201 })
}