import PostCard from "@/app/components/PostCard/page";
import Link from "next/link";
import type { Post, UserProfile } from '@prisma/client' 
import { PrismaClient } from '@prisma/client';

// 1. homepage handles postgird UI and data fecting 
// 2. while postcard.tsx handles the UI rendering(if data fetching inside postcard, will cause)
export default async function HomePage() {
  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany({
    include: {
      author: {
        include: {
          profile: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  }
  )
  return (
    <main>
      {/*grid-layout and auto adjust the postcard size while its clickable area is fixed with its size */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 p-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} userprofile={post.author.profile!}/>
        ))}
      </div>
    </main>
  );
}
