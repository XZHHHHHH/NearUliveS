// /app/api/chat/thread/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/chat/thread?conversationId=123
 * GET /api/chat/thread?conversationId=123&userId=45   ← optional auth check
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  /* ── extract & validate ─────────────────────────────────────────── */
  const convParam = searchParams.get('conversationId');
  const userParam = searchParams.get('userId');   // optional

  if (!convParam || isNaN(Number(convParam))) {
    return NextResponse.json(
      { error: 'Valid conversationId is required' },
      { status: 400 }
    );
  }
  const conversationId = Number(convParam);

  /* ── optional: confirm caller is in the conversation ────────────── */
  if (userParam) {
    if (isNaN(Number(userParam))) {
      return NextResponse.json(
        { error: 'userId must be numeric' },
        { status: 400 }
      );
    }
    const userId = Number(userParam);

    const convo = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { user1Id: true, user2Id: true }
    });

    if (
      !convo ||
      (convo.user1Id !== userId && convo.user2Id !== userId)
    ) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
  }

  /* ── fetch messages ─────────────────────────────────────────────── */
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error('Error fetching thread messages:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
