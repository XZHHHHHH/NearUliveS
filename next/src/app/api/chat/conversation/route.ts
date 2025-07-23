// app/api/chat/conversations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { transformUserToSafe } from '@/lib/userUtils';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { user1Id, user2Id } = await request.json();

    if (!user1Id || !user2Id) {
      return NextResponse.json({ message: 'Both user IDs are required' }, { status: 400 });
    }

    if (user1Id === user2Id) {
      return NextResponse.json({ message: 'Cannot start conversation with yourself' }, { status: 400 });
    }

    // Check if conversation already exists between these users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: user1Id, user2Id: user2Id },
          { user1Id: user2Id, user2Id: user1Id }
        ]
      },
      include: {
        user1: { include: { profile: true } },
        user2: { include: { profile: true } }
      }
    });

    if (existingConversation) {
      const safeUser1 = transformUserToSafe(existingConversation.user1);
      const safeUser2 = transformUserToSafe(existingConversation.user2);
      
      return NextResponse.json({ 
        conversationId: existingConversation.id,
        message: 'Conversation already exists',
        user1: safeUser1,
        user2: safeUser2
      });
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        user1Id: user1Id,
        user2Id: user2Id
      },
      include: {
        user1: { include: { profile: true } },
        user2: { include: { profile: true } }
      }
    });

    const safeUser1 = transformUserToSafe(conversation.user1);
    const safeUser2 = transformUserToSafe(conversation.user2);

    return NextResponse.json({ 
      conversationId: conversation.id,
      message: 'Conversation created successfully',
      user1: safeUser1,
      user2: safeUser2
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}