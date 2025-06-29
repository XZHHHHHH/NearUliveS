'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublishPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('../../api/post/create', {
      method: 'POST',
      body: JSON.stringify({ title, content, imageUrl }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/userprofile'); // Redirect to profile after publish
    } else {
      alert('Failed to publish');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-medium mb-8 text-gray-800">Create a Post</h1>
        
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-none focus:border-gray-400"
                placeholder="Enter your post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-md text-lg resize-none focus:outline-none focus:border-gray-400"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-none focus:border-gray-400"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Publish Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
