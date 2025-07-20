import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import CommentSection from 'app/components/CommentSection'

const prisma = new PrismaClient();

export default async function PostDetail({ params }) {
  // Await the params before accessing its properties
  const { id } = await params;
  
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        include: { profile: true }
      }
    },
  });

  if (!post) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Post not found.</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <article className="bg-white border border-gray-200 rounded p-6">
        <header className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {post.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              By {post.author.profile?.username ?? "Unknown author"}
            </span>
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        {post.imageUrl && (
          <div className="mb-4">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded border"
            />
          </div>
        )}

        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {post.content}
          </div>
        </div>

        <footer className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Post ID: {post.id}</span>
            <span>
              Published {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </footer>
      </article>
      {/*comment section for post comments*/}
      <CommentSection postId={post.id} />
    </main>
  );
}