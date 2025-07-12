import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { conversationId, userId } = await request.json();

  if (!conversationId || !userId) {
    return NextResponse.json(
      { error: 'Required fields missing' },
      { status: 400 }
    );
  }

  await prisma.message.updateMany({
    where: { conversationId, receiverId: userId, seen: false },
    data: { seen: true }
  });

  return NextResponse.json({ success: true });
}