import { PrismaClient} from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { error } from 'console';

const prisma = new PrismaClient();

// function POST runs async to increase efficiency without breaking the server.
// await ensures them to run in order.
// async is recommended for I/O(Input/Output) to perform efficiently. 

// req: NextRequest represents te incoming HTTP request
async function register(req: NextRequest) { 
    // read the JSON format request and extract is to JavaScript.
    const {email, password} = await req.json(); 

// findUnique is a Prisma method to search for a unique record
// 409 Conflict  is an official HTTP status code. It means: The request could not be completed because of a conflict with the current state of the resource
const exists = await prisma.user.findUnique({where:{ email }});
if (exists) {
    return NextResponse.json({ error: "Email already exists"}, {status: 409});
}

// bcrypt.hash(password: string, saltRounds: number)
// saltRounds stands for how secure the hasing process is
const hashPassword = await bcrypt.hash(password, 10);

const user = await prisma.user.create({
    data: { email, password: hashPassword},
});

return NextResponse.json({ 
    message: "User registered",
    user: {email: user.email},
});
} 

export{ register };