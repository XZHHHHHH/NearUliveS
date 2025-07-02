const mockPosts = [
  { id: 1, title: "ohtani", imageUrl: "/shohei-ohtani-1.webp", author: "chen"},
  { id: 2, title: "University Health Centre", imageUrl: "/UHC.webp", author: "Bob"},
  { id: 3, title: "Utown", imageUrl: "/town.webp", author: "Mike"},
  { id: 4, title: "Terrence", imageUrl: "/canteen terrence.png", author: "Ohtani"},
  { id: 5, title: "Swimming Pool", imageUrl: "/swimming pool.png", author: "Alice"},
  { id: 6, title: "University Health Centre", imageUrl: "/UHC.webp", author: "Bob"},
  { id: 7, title: "Utown", imageUrl: "/town.webp", author: "Mike"},
  { id: 8, title: "Terrence", imageUrl: "/canteen terrence.png", author: "Ohtani"},
  { id: 9, title: "Swimming Pool", imageUrl: "/swimming pool.png", author: "Alice"},
  { id: 10, title: "University Health Centre", imageUrl: "/UHC.webp", author: "Bob"},
  { id: 11, title: "Utown", imageUrl: "/town.webp", author: "Mike"},
  { id: 12, title: "Terrence", imageUrl: "/canteen terrence.png", author: "Ohtani"},
  { id: 13, title: "Swimming Pool", imageUrl: "/swimming pool.png", author: "Alice"},
  { id: 14, title: "University Health Centre", imageUrl: "/UHC.webp", author: "Bob"},
  { id: 15, title: "Utown", imageUrl: "/town.webp", author: "Mike"},
  { id: 16, title: "Terrence", imageUrl: "/canteen terrence.png", author: "chen"},
  { id: 17, title: "ohtani", imageUrl: "/shohei-ohtani-1.webp", author: "chen"},
  { id: 18, title: "ohtani", imageUrl: "/shohei-ohtani-1.webp", author: "chen"},
  { id: 19, title: "ohtani", imageUrl: "/shohei-ohtani-1.webp", author: "chen"},
  { id: 20, title: "ohtani", imageUrl: "/shohei-ohtani-1.webp", author: "chen"},
  { id: 21, title: "ohtani", imageUrl: "/shohei-ohtani-1.webp", author: "chen"},
  { id: 22, title: "ohtani", imageUrl: "/shohei-ohtani-1.webp", author: "chen"},
  { id: 23, title: "ohtani", imageUrl: "/shohei-ohtani-1.webp", author: "chen"},
  { id: 24, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 25, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 26, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 27, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 28, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 29, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 30, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 31, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 32, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 33, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 34, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
  { id: 35, title: "museum", imageUrl: "/museum.jpg", author: "chen"},
];

export default function PostDetail({ params }: { params: { id: string } }) {
  const post = mockPosts.find(p => p.id === Number(params.id));

  if (!post) return <div className="p-10 text-red-500">Post not found.</div>;

  return (
    <div className="p-10 space-y-4">
      <img src={post.imageUrl} className="rounded-xl max-h-[400px] w-full object-cover" />
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-500">By {post.author}</p>
    </div>
  );
}
