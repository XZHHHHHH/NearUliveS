import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Find all users without profiles
    const usersWithoutProfiles = await prisma.user.findMany({
      where: {
        profile: null
      },
      select: {
        id: true,
        email: true
      }
    });

    if (usersWithoutProfiles.length === 0) {
      return NextResponse.json({ 
        message: 'All users already have profiles',
        updated: 0
      });
    }

    // Create default profiles for users without profiles
    const createProfilePromises = usersWithoutProfiles.map(user => 
      prisma.userProfile.create({
        data: {
          userid: user.id,
          username: `Nuser${user.id}`,
          profileImage: '/globe.svg',
          bio: null,
        },
      })
    );

    await Promise.all(createProfilePromises);

    return NextResponse.json({ 
      message: `Successfully created default profiles for ${usersWithoutProfiles.length} users`,
      updated: usersWithoutProfiles.length,
      users: usersWithoutProfiles.map(u => ({ id: u.id, email: u.email }))
    });
  } catch (error) {
    console.error('Error creating default profiles:', error);
    return NextResponse.json(
      { error: 'Failed to create default profiles' },
      { status: 500 }
    );
  }
}
