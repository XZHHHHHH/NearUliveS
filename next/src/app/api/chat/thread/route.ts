import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');

    if (!senderId || !receiverId || isNaN(Number(senderId)) || isNaN(Number(receiverId))) {
      return NextResponse.json({ error: 'Valid sender ID and receiver ID are required' }, { status: 400 });
    }

    const senderIdNum = Number(senderId);
    const receiverIdNum = Number(receiverId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderIdNum, receiverId: receiverIdNum },
          { senderId: receiverIdNum, receiverId: senderIdNum }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching thread messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}