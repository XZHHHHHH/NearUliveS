import Image from 'next/image';

export default function PostCard({title, imageUrl, author}: {title: string; imageUrl: string; author: string}) {
  return (
    <div className="bg-white rounded-4xl overflow-hidden shadow-md w-[200px] hover:scale-105 hover:shadow-lg transition duration-200 ease-in-out cursor-pointer">
      <div>
        <Image src={imageUrl} alt={title} width={300} height={300}   className="object-cover rounded-4xl w-full h-72"/>
      </div> 
      <div className="pt-2 pb-2 pl-2 ">
        <h1 className="text-xs font-bold truncate">{title}</h1>
        <p className="text-xs text-gray-500">{author}</p>
      </div>
    </div>   
  );
}