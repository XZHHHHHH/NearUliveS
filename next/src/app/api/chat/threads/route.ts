import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = Number(searchParams.get('userId'));

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const conversations = await prisma.conversation.findMany({
    where: { OR: [ { user1Id: userId }, { user2Id: userId } ] },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      user1: { include: { profile: true } },
      user2: { include: { profile: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });

  const threads = await Promise.all(
    conversations.map(async conv => {
      const lastMessage = conv.messages[0];
      const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
      const unreadCount = await prisma.message.count({
        where: { conversationId: conv.id, receiverId: userId, seen: false }
      });
      return { conversationId: conv.id, user: otherUser, lastMessage, unreadCount };
    })
  );

  return NextResponse.json({ threads });
}