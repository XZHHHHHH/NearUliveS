'use client'

import { useState, useEffect, FormEvent } from 'react'

type Comment = {
  id: number
  content: string
  createdAt: string
  author: { profile?: { username?: string } }
}

export default function CommentsSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  // fetch existing comments for UI components to fetch 
  useEffect(() => {
    fetch(`/api/comments/${postId}`)
      .then(res => res.json())
      .then(setComments)
  }, [postId])

  // submit a comment
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return

    const res = await fetch(`/api/comments/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newComment,

      })
    })
    const created: Comment = await res.json()
    setComments([...comments, created])
    setNewComment('')
  }

   return (
    <section className="mt-6 bg-gray-50 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">Comments</h2>

      <div className="space-y-4 mb-6">
        {comments.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {(c.author?.profile?.username ?? 'A')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-800 text-sm">
                    {c.author?.profile?.username ?? 'Anonymous'}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {c.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input
          type="text"
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-300 transition-colors"
          placeholder="Write a comment…"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:shadow-md transition-shadow"
        >
          Post
        </button>
      </form>
    </section>
  )
}
