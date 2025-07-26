import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const likeCount = await prisma.like.count({
      where: { postId }
    });

    return NextResponse.json({ likeCount });
  } catch (error) {
    console.error('Error fetching like count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch like count' },
      { status: 500 }
    );
  }
}
