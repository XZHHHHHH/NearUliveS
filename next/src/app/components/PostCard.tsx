import Image from 'next/image';
import Link from 'next/link';
import type { Post, UserProfile } from '@prisma/client' 

// an object name Props to contain arguments with its specific type
type Props = {
  post: Post & { likes?: number };
  userprofile: UserProfile;
}

{/*postcard appearance*/}
export default function PostCard({ post, userprofile }: Props) {
  return (
    <div className="flex justify-center">
      <Link 
        href={`/post/${post.id}`}
        className="block w-[200px] bg-white rounded-4xl overflow-hidden shadow-md cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
      >
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
          <p className="text-xs text-gray-500">{userprofile?.username ?? "Anonymous"}</p>
        </div>
      </Link>
    </div>
  );
}
