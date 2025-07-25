'use client';

import Image from 'next/image';
import Link from 'next/link';
import LikeButton from './LikeButton';
import type { Post, UserProfile } from '@prisma/client';
import { useState } from 'react';

// an object name Props to contain arguments with its specific type
type Props = {
  post: Post & { likes?: number };
  userprofile: UserProfile;
  likeCount?: number;
  isLikedByUser?: boolean;
}

{/*postcard appearance*/}
export default function PostCard({ post, userprofile, likeCount = 0, isLikedByUser = false }: Props) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error('Failed to load image:', post.imageUrl);
    setImageError(true);
  };

  // Function to determine if image is Base64 or regular URL
  const isBase64Image = (url: string) => {
    return url.startsWith('data:image/');
  };

  return (
    <div className="flex justify-center">
      <div className="w-[200px] bg-white rounded-4xl overflow-hidden shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
        <Link href={`/post/${post.id}`} className="block">
          {post.imageUrl && !imageError ? (
            isBase64Image(post.imageUrl) ? (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-72 object-cover rounded-t-4xl"
                onError={handleImageError}
              />
            ) : (
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={300}
                height={300}
                className="w-full h-72 object-cover rounded-t-4xl"
                onError={handleImageError}
              />
            )
          ) : (
            <div className="w-full h-72 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-4xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-500 text-xs">No Image</span>
              </div>
            </div>
          )}
          <div className="px-3 py-2">
            <Link href={`/post/${post.id}`} className="block">
              <h1 className="text-xs font-bold truncate">{post.title}</h1>
            </Link>
            <div className="flex items-center justify-between">
              <Link 
                href={`/userprofile?userId=${userprofile?.userid}`}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                {userprofile?.profileImage ? (
                  <Image
                    src={userprofile.profileImage}
                    alt={userprofile.username ?? "User"}
                    width={16}
                    height={16}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-4 h-4 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {(userprofile?.username ?? 'A')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-500">{userprofile?.username ?? "Anonymous"}</p>
              </Link>
              <div onClick={(e) => e.stopPropagation()}>
                <LikeButton 
                  postId={post.id} 
                  initialLiked={isLikedByUser}
                  initialLikeCount={likeCount}
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
