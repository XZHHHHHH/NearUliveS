import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import CommentSection from '../../components/CommentSection'
import LikeButton from '../../components/LikeButton';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export default async function PostDetail({ params }) {
  // Await the params before accessing its properties
  const { id } = await params;
  
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('userEmail')?.value;
  
  // Get current user for like checking
  const currentUser = userEmail ? await prisma.user.findUnique({
    where: { email: userEmail }
  }) : null;
  
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        include: { profile: true }
      },
      Like: {
        select: {
          userId: true
        }
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

  const likeCount = post.Like.length;
  const isLikedByUser = currentUser ? post.Like.some(like => like.userId === currentUser.id) : false;

  return (
    <main className="p-6 max-w-5xl mx-auto">
      {/* Go Back Navigation */}
      <div className = "mb-6">
        <Link 
          href="/home" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          {/* Left Arrow Icon */}
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to Home
        </Link>
      </div>

      <article className="bg-white border border-gray-200 rounded p-6">
        <header className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {post.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <Link 
              href={`/userprofile?userId=${post.author.id}`}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              {post.author.profile?.profileImage ? (
                <Image
                  src={post.author.profile.profileImage}
                  alt={post.author.profile.username ?? "User"}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(post.author.profile?.username ?? 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span>
                By {post.author.profile?.username ?? "Unknown author"}
              </span>
            </Link>
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
          {/* Like button section */}
          <div className="mb-4">
            <LikeButton 
              postId={post.id} 
              initialLiked={isLikedByUser}
              initialLikeCount={likeCount}
            />
          </div>
          
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