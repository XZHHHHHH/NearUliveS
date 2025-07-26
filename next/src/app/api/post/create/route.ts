import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body received for post creation");

    const { title, content, imageUrl } = body;

    // Validate input
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const userEmail = cookieStore.get("userEmail")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate imageUrl if provided (should be Base64 or null)
    let validatedImageUrl = null;
    if (imageUrl && imageUrl.trim()) {
      const trimmedImageUrl = imageUrl.trim();
      // Check if it's a valid Base64 data URL or regular URL
      if (trimmedImageUrl.startsWith('data:image/') || trimmedImageUrl.startsWith('/') || trimmedImageUrl.startsWith('http')) {
        validatedImageUrl = trimmedImageUrl;
        console.log("Image URL validated - storing in database");
      } else {
        console.warn("Invalid image URL format:", trimmedImageUrl);
      }
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        imageUrl: validatedImageUrl,
        authorId: user.id,
      },
    });

    console.log("Post created successfully with ID:", post.id, "Has image:", !!validatedImageUrl);
    return NextResponse.json({ success: true, post });
  } catch (err) {
    console.error("POST /api/post/create failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

