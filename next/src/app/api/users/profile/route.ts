import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If user doesn't have a profile, create a default one
    if (!user.profile) {
      const defaultUsername = `Nuser${user.id}`;
      const defaultProfileImage = '/globe.svg';
      
      const newProfile = await prisma.userProfile.create({
        data: {
          userid: user.id,
          username: defaultUsername,
          profileImage: defaultProfileImage,
          bio: null,
        },
      });

      return NextResponse.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          profile: {
            username: newProfile.username,
            bio: newProfile.bio,
            profileImage: newProfile.profileImage,
          }
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile ? {
          username: user.profile.username,
          bio: user.profile.bio,
          profileImage: user.profile.profileImage,
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, username, profileImage, bio } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Find or create user profile
    const profile = await prisma.userProfile.upsert({
      where: {
        userid: userId,
      },
      update: {
        username: username || undefined,
        profileImage: profileImage || undefined,
        bio: bio || undefined,
      },
      create: {
        userid: userId,
        username,
        profileImage,
        bio,
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
