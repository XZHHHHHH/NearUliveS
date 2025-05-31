import Image from 'next/image';

export default function PostCard({title, imageUrl, author}: {title: string; imageUrl: string; author: string}) {
  return (
    <div className="bg-white rounded-full">
      <Image src={imageUrl} alt={title} width={300} height={200}/>
      <div className="p-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-xs text-gray-500">{author}</p>
      </div>
    </div>
  );
}