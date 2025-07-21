import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const { userId, username, profileImage } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Find or create user profile
    let profile = await prisma.userProfile.upsert({
      where: {
        userid: userId,
      },
      update: {
        username: username || undefined,
        profileImage: profileImage || undefined,
      },
      create: {
        userid: userId,
        username,
        profileImage,
      },
    });

    // Get updated user with profile
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
