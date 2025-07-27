import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('userEmail')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get counts for different notification types
    const [allCount, likesCount, commentsCount] = await Promise.all([
      prisma.notification.count({
        where: { userId: user.id, read: false }
      }),
      prisma.notification.count({
        where: { userId: user.id, type: 'like', read: false }
      }),
      prisma.notification.count({
        where: { userId: user.id, type: 'comment', read: false }
      }),
    ]);

    return NextResponse.json({
      all: allCount,
      likes: likesCount,
      comments: commentsCount,
    });
  } catch (error) {
    console.error('Error fetching notification counts:', error);
    return NextResponse.json({ error: 'Failed to fetch notification counts' }, { status: 500 });
  }
}
