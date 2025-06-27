import Image from 'next/image';

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
    <div className="bg-white rounded-4xl overflow-hidden shadow-md w-[200px] hover:scale-105 hover:shadow-lg transition duration-200 ease-in-out cursor-pointer">
      <div>
        <Image src={post.imageUrl} alt={post.title} width={300} height={300}   className="object-cover rounded-4xl w-full h-72"/>
      </div> 
      <div className="pt-2 pb-2 pl-2 ">
        <h1 className="text-xs font-bold truncate">{post.title}</h1>
        <p className="text-xs text-gray-500">{userprofile.username}</p>
      </div>
    </div>   
  );
}