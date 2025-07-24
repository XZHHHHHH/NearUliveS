import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const excludeId = searchParams.get('excludeId');

    if (!query || !query.trim()) {
      return NextResponse.json({ users: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          // Exclude the current user
          excludeId ? {
            id: {
              not: parseInt(excludeId)
            }
          } : {},
          // Search by email or username
          {
            OR: [
              {
                email: {
                  contains: query.trim(),
                  mode: 'insensitive'
                }
              },
              {
                profile: {
                  username: {
                    contains: query.trim(),
                    mode: 'insensitive'
                  }
                }
              }
            ]
          }
        ]
      },
      include: {
        profile: {
          select: {
            username: true,
            bio: true,
            profileImage: true
          }
        }
      },
      take: 20,
      orderBy: {
        id: 'asc'
      }
    });

    // Transform users to ensure safe data structure
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email || '',
      profile: user.profile ? {
        username: user.profile.username || null,
        bio: user.profile.bio || null,
        profileImage: user.profile.profileImage || null
      } : null
    }));

    return NextResponse.json({ users: safeUsers });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}
