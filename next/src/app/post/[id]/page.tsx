import { PrismaClient } from '@prisma/client';
import Image from 'next/image';

const prisma = new PrismaClient();

export default async function PostDetail({
  params,
  searchParams,
}) {
  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
    include: { author: { include: { profile: true } } },
  });

  if (!post) return <div className="p-10 text-red-500">Post not found.</div>;
  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-2">
        By {post.author.profile?.username ?? "Userprofile missing"}
      </p>
      <Image
        src={post.imageUrl}
        alt={post.title}
        width={800}
        height={500}
        className="w-full h-auto rounded-lg object-cover"
      />
    </main>
  );
}
