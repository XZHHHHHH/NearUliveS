'use client';
import Image from 'next/image';
import type { UserProfile, Post } from '@prisma/client';

type Props = {
  profile: UserProfile;
  posts: Post[];
};

export default function UserProfile({ profile, posts }: Props) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex items-center space-x-6 border-b pb-6">
        <Image
          src={profile.profileImage || '/swimming pool.png'}
          alt="User Avatar"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-sm text-gray-500">@{profile.username}</p>
          <p className="text-gray-600 mt-2">Bio：{profile.bio || "No bio yet."}</p>
        </div>
      </div>

      {/* User Posts*/}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-3">
                <h3 className="font-medium truncate">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
