'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DropdownMenu, { DropdownMenuItem } from './DropdownMenu';
import CommentSection from './CommentSection';
import LikeButton from './LikeButton';

interface PostDetailClientProps {
  post: {
    id: number;
    title: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    author: {
      id: number;
      email: string;
      profile: {
        username: string | null;
        profileImage: string | null;
      } | null;
    };
  };
  currentUser: {
    id: number;
    email: string;
  } | null;
  likeCount: number;
  isLikedByUser: boolean;
}

export default function PostDetailClient({ 
  post, 
  currentUser, 
  likeCount, 
  isLikedByUser 
}: PostDetailClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Check if current user is the author of the post
  const isAuthor = currentUser && currentUser.id === post.author.id;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/post/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ postId: post.id }),
      });

      if (response.ok) {
        // Redirect to home page after successful deletion
        router.push('/home');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="p-6 max-w-5xl mx-auto">
      {/* Go Back Navigation */}
      <div className="mb-6">
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

      <article className="bg-white border border-gray-200 rounded p-6 relative">
        {/* Three-dot menu - only show for post author */}
        {isAuthor && (
          <div className="absolute top-4 right-4 z-10">
            <DropdownMenu
              trigger={
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={isDeleting}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              }
            >
              <DropdownMenuItem onClick={handleDelete} danger={true}>
                {isDeleting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </div>
                )}
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        )}

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
            <time dateTime={post.createdAt}>
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
            {post.imageUrl.startsWith('data:image/') ? (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-64 object-cover rounded border"
              />
            ) : (
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded border"
              />
            )}
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
      
      {/* Comment section for post comments */}
      <CommentSection postId={post.id} />
    </main>
  );
}
