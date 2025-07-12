import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));

  const messages = await prisma.message.findMany({
    where: { receiverId: userId },
    include: { sender: { include: { profile: true } } },
    orderBy: { createdAt: 'desc' },
    distinct: ['senderId']
  });

  return NextResponse.json({ messages });
}