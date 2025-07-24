'use client'

import { useState, useEffect, FormEvent } from 'react'

type Comment = {
  id: number
  content: string
  createdAt: string
  author: { profile?: { username?: string } }
  likes?: number
}

export default function CommentsSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())

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

  const handleLike = (commentId: number) => {
    const newLikedComments = new Set(likedComments)
    if (newLikedComments.has(commentId)) {
      newLikedComments.delete(commentId)
    } else {
      newLikedComments.add(commentId)
    }
    setLikedComments(newLikedComments)
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const commentDate = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return commentDate.toLocaleDateString()
  }

  const displayedComments = isExpanded ? comments : comments.slice(0, 3)

  return (
    <section className="mt-6 bg-gray-50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            💬 Comments
          </span>
        </h2>
        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
          {comments.length}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {displayedComments.map(c => (
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
                    {formatTimeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {c.content}
                </p>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(c.id)}
                    className={`flex items-center space-x-1 text-xs transition-colors ${
                      likedComments.has(c.id) 
                        ? 'text-pink-500' 
                        : 'text-gray-400 hover:text-pink-500'
                    }`}
                  >
                    <span className="text-base">
                      {likedComments.has(c.id) ? '❤️' : '🤍'}
                    </span>
                    <span>{(c.likes || 0) + (likedComments.has(c.id) ? 1 : 0)}</span>
                  </button>
                  
                  <button className="text-gray-400 hover:text-gray-600 text-xs transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Show more/less button */}
        {comments.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
          >
            {isExpanded 
              ? `Show less (${comments.length - 3} hidden)` 
              : `View all ${comments.length} comments`
            }
          </button>
        )}
      </div>

      {/* Comment input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center space-x-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 focus-within:border-pink-300 focus-within:shadow-md transition-all">
          {/* User avatar for input */}
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">U</span>
          </div>
          
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          
          <button
            type="submit"
            disabled={!newComment.trim()}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              newComment.trim()
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </section>
  )
}
