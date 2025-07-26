import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('userEmail')?.value;

    console.log('Debug - userEmail from cookie:', userEmail);

    if (!userEmail) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        cookies: Object.fromEntries(cookieStore.getAll().map(c => [c.name, c.value]))
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        profile: true
      }
    });

    console.log('Debug - user found:', user ? { id: user.id, email: user.email } : null);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all notifications for this user
    const allNotifications = await prisma.notification.findMany({
      where: { userId: user.id },
      include: {
        fromUser: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get all notifications from this user (notifications they caused)
    const notificationsFromUser = await prisma.notification.findMany({
      where: { fromUserId: user.id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get all posts by this user
    const userPosts = await prisma.post.findMany({
      where: { authorId: user.id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        _count: {
          select: {
            Like: true,
            Comment: true
          }
        }
      }
    });

    // Get all likes by this user
    const userLikes = await prisma.like.findMany({
      where: { userId: user.id },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            authorId: true
          }
        }
      }
    });

    console.log('Debug - all notifications:', allNotifications.length);

    // Get counts manually
    const counts = {
      all: await prisma.notification.count({
        where: { userId: user.id, read: false }
      }),
      likes: await prisma.notification.count({
        where: { userId: user.id, type: 'like', read: false }
      }),
      comments: await prisma.notification.count({
        where: { userId: user.id, type: 'comment', read: false }
      }),
      follows: await prisma.notification.count({
        where: { userId: user.id, type: 'follow', read: false }
      }),
    };

    console.log('Debug - counts:', counts);

    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, email: user.email },
      totalNotifications: allNotifications.length,
      unreadCounts: counts,
      notifications: allNotifications.map(n => ({
        id: n.id,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt,
        message: n.message,
        postId: n.postId,
        fromUser: n.fromUser.email
      })),
      notificationsFromUser: notificationsFromUser.map(n => ({
        id: n.id,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt,
        message: n.message,
        postId: n.postId,
        toUser: n.user.email
      })),
      userPosts: userPosts,
      userLikes: userLikes.map(like => ({
        postId: like.post.id,
        postTitle: like.post.title,
        postAuthorId: like.post.authorId,
        isOwnPost: like.post.authorId === user.id
      }))
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ error: 'Debug failed', details: error }, { status: 500 });
  }
}
