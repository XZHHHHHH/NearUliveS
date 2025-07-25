import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// function POST runs async to increase efficiency without breaking the server.
// await ensures them to run in order.
// async is recommended for I/O(Input/Output) to perform efficiently. 

// req: NextRequest represents the incoming HTTP request
async function register(req: NextRequest) { 
    // read the JSON format request and extract it to JavaScript.
    const { email, password, confirmPassword } = await req.json(); 

    // findUnique is a Prisma method to search for a unique record
    // 409 Conflict is an official HTTP status code. It means: 
    // The request could not be completed because of a conflict with the current state of the resource
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    if (confirmPassword !== password) {
        return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // bcrypt.hash(password: string, saltRounds: number)
    // saltRounds stands for how secure the hashing process is
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user and default profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
        // Create the user first
        const user = await tx.user.create({
            data: { email, password: hashPassword },
        });

        // Create default profile with username and default image
        const defaultUsername = `Nuser${user.id}`;
        const defaultProfileImage = '/globe.svg'; // Default image from public folder
        
        const profile = await tx.userProfile.create({
            data: {
                userid: user.id,
                username: defaultUsername,
                profileImage: defaultProfileImage,
                bio: null,
            },
        });

        return {
            user,
            profile
        };
    });

    return NextResponse.json({ 
        message: "User registered successfully",
        user: { 
            id: result.user.id,
            email: result.user.email,
            profile: {
                username: result.profile.username,
                profileImage: result.profile.profileImage,
                bio: result.profile.bio
            }
        },
    });
} 

async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({ 
        where: { email },
        include: { profile: true } // Include profile data
    });
    
    if (!user) {
        return { success: false, error: "Invalid email", field: "email", status: 401 };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return { success: false, error: "Wrong password", field: "password", status: 401 };
    }

    // Return complete user data needed for chat
    return {
        success: true,
        message: "Login successful",
        status: 200,
        user: {
            id: user.id,
            email: user.email,
            profile: user.profile
        },
    };
}

export {register, login};