'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { UserProfile, Post, Like } from '@prisma/client';
import { getImageUrl } from '@/lib/userUtils';

type PostWithLikes = Post & {
  Like: Like[];
};

type Props = {
  profile: UserProfile;
  posts: PostWithLikes[];
};

// every page.tsx is treated as a page component in react.js and the funciton used inside (example here is UserProfile function) can only accept (instead of customized props, E.g profile and posts which are named by the users)
// 1. params and 
// 2. searchParams as props (the props must be named like these two)

//But why I only put this file with FullUserProfile.tsx without folder as it must be treated as a client component which(need to add 'use client' and must exist as a file)
//1. can make use of customized props
//2. able to make use of React's functionalities: useState, useEffect, useContext, event handlers.
//3. Needed for interactive UI: forms, modals, real-time updates, etc.

export default function UserProfile({ profile, posts }: Props) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center space-x-8 border-b pb-8 mb-8">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
            <Image
              src={getImageUrl(profile.profileImage)}
              alt="User Avatar"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
            <p className="text-lg text-gray-600 mb-3">@{profile.username}</p>
            <p className="text-gray-700">Bio：{profile.bio || "No bio yet."}</p>
          </div>
        </div>

        {/* User Posts*/}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/post/${post.id}`}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 bg-white cursor-pointer transform hover:scale-[1.02]"
              >
                {post.imageUrl && (
                  <Image 
                    src={post.imageUrl} 
                    alt={post.title} 
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover" 
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate hover:text-blue-600 transition-colors">{post.title}</h3>
                  <div className="text-sm text-gray-600 mb-2 overflow-hidden" style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {post.content || "No content available"}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{post.Like.length}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}