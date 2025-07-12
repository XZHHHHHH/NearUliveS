import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Use the updated login function
        const result = await login(email, password);
        
        if (!result.success) {
            return NextResponse.json(
                { error: result.error, field: result.field },
                { status: result.status }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
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
