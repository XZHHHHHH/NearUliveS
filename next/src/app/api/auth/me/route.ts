import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('userEmail')?.value;

    console.log('Auth /me endpoint - userEmail from cookie:', userEmail);

    if (!userEmail) {
      console.log('Auth /me endpoint - No userEmail cookie found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        profile: true,
      },
    });

    if (!user) {
      console.log('Auth /me endpoint - User not found for email:', userEmail);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Auth /me endpoint - User found:', { id: user.id, email: user.email });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      profile: user.profile,
    });
  } catch (error) {
    console.error('Auth /me endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}