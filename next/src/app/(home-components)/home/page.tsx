'use client';
import PostCard from "@/app/components/PostCard";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Post, User, UserProfile, Like } from '@prisma/client';

type PostWithAuthorAndLikes = Post & {
  author: User & {
    profile: UserProfile | null;
  };
  Like: Pick<Like, 'userId'>[];
  likeCount: number;
  isLikedByUser: boolean;
};

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostWithAuthorAndLikes[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUserAndPosts = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
          await fetchPosts();
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUserAndPosts();
  }, [router]);

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
