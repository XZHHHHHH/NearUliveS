'use client';
import PostCard from "@/app/components/PostCard";
import { useState, useEffect } from 'react';
import type { Post, User, UserProfile, Like } from '@prisma/client';

type PostWithAuthorAndLikes = Post & {
  author: User & {
    profile: UserProfile | null;
  };
  Like: Pick<Like, 'userId'>[];
  likeCount: number;
  isLikedByUser: boolean;
};

// 1. homepage handles postgird UI and data fecting 
// 2. while postcard.tsx handles the UI rendering(if data fetching inside postcard, will cause)
export default function HomePage() {
  const [posts, setPosts] = useState<PostWithAuthorAndLikes[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }

    // Fetch posts
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="ml-2 text-gray-600">Loading posts...</span>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/*grid-layout and auto adjust the postcard size while its clickable area is fixed with its size */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 p-8">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            userprofile={post.author.profile!}
            likeCount={post.likeCount}
            isLikedByUser={post.isLikedByUser}
          />
        ))}
      </div>
    </main>
  );
}
