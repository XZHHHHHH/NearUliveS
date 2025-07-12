import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { conversationId, senderId, receiverId, content } = await request.json();

  if (!senderId || !receiverId || !content?.trim()) {
    return NextResponse.json(
      { error: 'Required fields missing' },
      { status: 400 }
    );
  }

  if (senderId === receiverId) {
    return NextResponse.json(
      { error: "Can't send a message to yourself" },
      { status: 400 }
    );
  }

  // find or create conversation
  let convId = conversationId;

  if (!convId) {
    let conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId }
        ]
      }
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: { user1Id: senderId, user2Id: receiverId }
      });
    }

    convId = conv.id;
  }

  const message = await prisma.message.create({
    data: {
      conversationId: convId,
      senderId,
      receiverId,
      content: content.trim(),
      seen: false
    }
  });

  // bump conversation timestamp
  await prisma.conversation.update({
    where: { id: convId },
    data: { updatedAt: new Date() }
  });

  return NextResponse.json({ message });
}