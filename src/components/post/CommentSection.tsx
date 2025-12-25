'use client'

import React, { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import UserAvatar from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { timeAgo } from '@/lib/utils'
import { getComments, addComment } from '@/lib/api/poem'
import { Comment } from '@/types/comment'
import { useAppSelector } from '@/lib/hooks/reduxHooks'
import { selectToken, selectIsAuthenticated, selectUser } from '@/lib/store/auth/authSlice'

interface CommentSectionProps {
  poemId: number
  isOpen: boolean
  onClose: () => void
}

const CommentSection: React.FC<CommentSectionProps> = ({ poemId, isOpen, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const token = useAppSelector(selectToken)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)

  useEffect(() => {
    if (isOpen) {
      fetchComments()
    }
  }, [isOpen, poemId])

  const fetchComments = async () => {
    try {
      const fetchedComments = await getComments(poemId, token || undefined)
      setComments(fetchedComments)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleAddComment = async () => {
    if (!isAuthenticated || !token || !newComment.trim()) return

    setLoading(true)
    try {
      const comment = await addComment(poemId, newComment.trim(), token)
      setComments(prev => [comment, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="comment-section bg-white border-t border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
      </div>

      {isAuthenticated && (
        <div className="comment-input flex gap-3 mb-4">
          <UserAvatar className="w-8 h-8" fallbackText={user?.username.charAt(0).toUpperCase() || "U"} />
          <div className="flex-1 flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 min-h-[60px] resize-none"
            />
            <Button
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              size="sm"
              className="self-end"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}

      <div className="comments-list space-y-4 max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="comment flex gap-3">
            <UserAvatar src={comment.avt_url} className="w-8 h-8" fallbackText={comment.user_name.charAt(0).toUpperCase() || "U"} />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{comment.full_name}</span>
                  <span className="text-xs text-gray-500">@{comment.user_name}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{timeAgo(comment.created_at)}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}

export default CommentSection