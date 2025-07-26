'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IoHomeOutline } from "react-icons/io5";
import PostCard from '@/app/components/PostCard';
import type { Post, User, UserProfile, Like } from '@prisma/client';

type PostWithAuthorAndLikes = Post & {
  author: User & {
    profile: UserProfile | null;
  };
  Like: Pick<Like, 'userId'>[];
};

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<PostWithAuthorAndLikes[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }, []);

  useEffect(() => {
    const searchPosts = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`, {
          credentials: 'include'
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to search posts');
        }
        
        setPosts(data.posts);
      } catch (err) {
        console.error('Error searching posts:', err);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchPosts();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {query ? `Search results for "${query}"` : 'Search Results'}
        </h1>
        <Link
          href="/home"
          className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          aria-label="Return to home"
        >
          <IoHomeOutline size={24} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          {query ? 'No posts found matching your search.' : 'Enter a search term to find posts.'}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
          {posts.map((post) => {
            const likeCount = post.Like.length;
            const isLikedByUser = currentUser ? post.Like.some(like => like.userId === currentUser.id) : false;
            
            return (
              <PostCard 
                key={post.id} 
                post={post} 
                userprofile={post.author.profile || { id: 0, bio: null, profileImage: null, username: post.author.email, createdAt: new Date(), userid: post.author.id }} 
                likeCount={likeCount}
                isLikedByUser={isLikedByUser}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
