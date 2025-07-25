'use client';

import { useState, useEffect } from 'react';

interface LikeButtonProps {
  postId: number;
  initialLiked?: boolean;
  initialLikeCount?: number;
}

export default function LikeButton({ postId, initialLiked = false, initialLikeCount = 0 }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/post/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-colors ${
        liked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-500 hover:text-red-500'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg
        className={`w-4 h-4 ${liked ? 'fill-current' : ''}`}
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="text-xs">{likeCount}</span>
    </button>
  );
}
