// app/api/users/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const excludeId = searchParams.get('excludeId');
    
    if (!q || typeof q !== 'string') {
      return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
    }

    const searchQuery = q.trim();
    const excludeUserId = excludeId ? parseInt(excludeId) : undefined;

    const users = await prisma.user.findMany({
      where: {
        AND: [
          excludeUserId ? { id: { not: excludeUserId } } : {},
          {
            OR: [
              { email: { contains: searchQuery, mode: 'insensitive' } },
              { profile: { username: { contains: searchQuery, mode: 'insensitive' } } }
            ]
          }
        ]
      },
      include: {
        profile: {
          select: {
            username: true,
            profileImage: true
          }
        }
      },
      take: 10, // Limit results
      orderBy: [
        { profile: { username: 'asc' } },
        { email: 'asc' }
      ]
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}