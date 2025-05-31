import PostCard from "../../components/PostCard/page";

const mockPosts = [
  { id: 1, title: "Swimming Pool", imageUrl: "/swimming pool.png", author: "Alice"},
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
  { id: 16, title: "Terrence", imageUrl: "/canteen terrence.png", author: "Ohtani"},
  { id: 17, title: "Utown", imageUrl: "/town.webp", author: "Mike"},
  { id: 18, title: "Terrence", imageUrl: "/canteen terrence.png", author: "Ohtani"},
];

export default function HomePage() {
  return (
    <main>
      {/*control on number of posts in a row*/ }
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8 m-8">
        {mockPosts.map(
          (post) => (
            <PostCard key={post.id} title={post.title} imageUrl={post.imageUrl} author={post.author}/>
          )
        )}
      </div>
    </main> 
  );
}