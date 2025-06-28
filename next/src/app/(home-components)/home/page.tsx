import PostCard from "@/app/components/PostCard/page";
import Link from "next/link";
import type { Post, UserProfile } from '@prisma/client' 
import { PrismaClient } from '@prisma/client';

type Props = {
  post: Post;
  userprofile: UserProfile;
}

// 1. homepage handles postgird UI and data fecting 
// 2. while postcard.tsx handles the UI rendering(if data fetching inside postcard, will cause)
export default async function HomePage({ post, userprofile } : Props) {
  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany({
    include: {
      author: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8 m-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`}>
            <PostCard post={post} userprofile={post.author.profile!} />
          </Link>
        ))}
      </div>
    </main>
  );
}
