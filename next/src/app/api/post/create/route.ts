import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { title, content, imageUrl } = body;

    const cookieStore = await cookies();
    const userEmail = cookieStore.get("userEmail")?.value;
    console.log("User email from cookie:", userEmail);

    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        authorId: user.id,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (err) {
    console.error("POST /api/post/create failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

