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
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>

      <ul className="space-y-4">
        {comments.map(c => (
          <li key={c.id} className="p-3 border rounded">
            <p className="text-sm text-gray-600">
              {c.author?.profile?.username ?? 'Anonymous'} 
              <span className="ml-2 text-xs">{new Date(c.createdAt).toLocaleString()}</span>
            </p>
            <p className="mt-1">{c.content}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mt-6 flex space-x-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Write a comment…"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </form>
    </section>
  )
}
