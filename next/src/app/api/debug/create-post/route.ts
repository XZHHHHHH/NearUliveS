import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, title, content } = await request.json();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create test post
    const post = await prisma.post.create({
      data: {
        title: title || `Test Post by ${user.email}`,
        content: content || `This is a test post created at ${new Date().toLocaleString()}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        authorId: user.id,
        imageUrl: 'https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 1000), // Random test image
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error creating test post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
