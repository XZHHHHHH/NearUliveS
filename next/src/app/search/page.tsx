'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/app/components/PostCard';
import type { Post, User, UserProfile } from '@prisma/client';

type PostWithAuthor = Post & {
  author: User & {
    profile: UserProfile | null;
  };
};

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const searchPosts = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`);
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
      <h1 className="text-2xl font-bold mb-4">
        {query ? `Search results for "${query}"` : 'Search Results'}
      </h1>

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
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              userprofile={post.author.profile || { id: 0, bio: null, profileImage: null, username: post.author.email, createdAt: new Date(), userid: post.author.id }} 
            />
          ))}
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
