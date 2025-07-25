'use client';

import Image from 'next/image';
import Link from 'next/link';
import LikeButton from './LikeButton';
import type { Post, UserProfile } from '@prisma/client' 

// an object name Props to contain arguments with its specific type
type Props = {
  post: Post & { likes?: number };
  userprofile: UserProfile;
  likeCount?: number;
  isLikedByUser?: boolean;
}

{/*postcard appearance*/}
export default function PostCard({ post, userprofile, likeCount = 0, isLikedByUser = false }: Props) {
  return (
    <div className="flex justify-center">
      <div className="w-[200px] bg-white rounded-4xl overflow-hidden shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
        <Link href={`/post/${post.id}`} className="block">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={300}
              height={300}
              className="w-full h-72 object-cover rounded-t-4xl"
            />
          ) : (
            <div className="w-full h-72 bg-gray-200 flex items-center justify-center rounded-t-4xl">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
          <div className="px-3 py-2">
            <h1 className="text-xs font-bold truncate">{post.title}</h1>
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
              <LikeButton 
                postId={post.id} 
                initialLiked={isLikedByUser}
                initialLikeCount={likeCount}
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
