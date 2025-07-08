'use client';
import Image from 'next/image';
import type { UserProfile, Post } from '@prisma/client';

type Props = {
  profile: UserProfile;
  posts: Post[];
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
          <Image
            src={profile.profileImage || '/globe.svg'}
            alt="User Avatar"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
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
              <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white">
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}