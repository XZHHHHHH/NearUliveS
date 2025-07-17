import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params
  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
    include: { author: { select: { profile: { select: { username: true } } } } },
    orderBy: { createdAt: 'asc' }
  })
  return NextResponse.json(comments)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params
  const { content, authorId } = await req.json()
  const comment = await prisma.comment.create({
    data: {
      postId: Number(postId),
      content,
      authorId: authorId ?? null
    },
    include: { author: { select: { profile: { select: { username: true } } } } }
  })
  return NextResponse.json(comment, { status: 201 })
}