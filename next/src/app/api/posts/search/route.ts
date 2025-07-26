import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    let whereClause = {};

    if (query && query.trim()) {
      whereClause = {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'  // Case-insensitive search
            }
          },
          {
            content: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'  // Most recent posts first
      },
      take: 20  // Limit to 20 results
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
}
