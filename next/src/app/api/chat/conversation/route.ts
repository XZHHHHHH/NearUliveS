// app/api/chat/conversations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
      }
    });

    if (existingConversation) {
      return NextResponse.json({ 
        conversationId: existingConversation.id,
        message: 'Conversation already exists' 
      });
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        user1Id: user1Id,
        user2Id: user2Id
      }
    });

    return NextResponse.json({ 
      conversationId: conversation.id,
      message: 'Conversation created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}