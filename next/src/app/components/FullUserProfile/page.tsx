'use client';
import Image from 'next/image';
import type { UserProfile, Post } from '@prisma/client';

type Props = {
  profile: UserProfile;
  posts: Post[];
};

export default function UserProfile({ profile, posts }: Props) {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <Image
          src={profile.profileImage || '/swimming pool.png'}
          alt="Avatar"
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <h1 className="text-xl font-bold">{profile.username}</h1>
          <p className="text-sm text-gray-500">@{profile.username}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Your Posts</h2>
        <div className="grid gap-4 mt-4">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded-md shadow">
              <h3 className="font-bold">{post.title}</h3>
              <p>{post.content}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="" className="mt-2 rounded" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}