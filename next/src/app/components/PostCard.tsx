import Image from 'next/image';
import Link from 'next/link';
/// In js, we need to set type for arguments and in this Postcard function, can import the related prisma model to fill in the related arguments based on how we define the prisma models
import type { Post, UserProfile } from '@prisma/client' 

// an object name Props to contain arguments with its specific type
type Props = {
  post: Post;
  userprofile: UserProfile;
}

{/*postcard appearance*/}
export default function PostCard({ post, userprofile }: Props) {
  return (
    <Link href={`/post/${post.id}`}>
      <div className="w-[200px] bg-white rounded-4xl overflow-hidden shadow-md cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={300}
          height={300}
          className="w-full h-72 object-cover rounded-t-4xl"
        />
        <div className="px-3 py-2">
          <h1 className="text-xs font-bold truncate">{post.title}</h1>
          <p className="text-xs text-gray-500">{userprofile?.username ?? "Anonymous"}</p>
        </div>
      </div>
    </Link>
  );
}