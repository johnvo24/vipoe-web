'use client'

import React, { useRef, useState } from 'react'
import { Globe, GlobeLock, MoreVertical } from 'lucide-react'
import UserAvatar from '@/components/ui/avatar'
import { timeAgo } from '@/lib/utils'
import Link from 'next/link'
import InteractionBox from './InteractionBox'
import { likePoem, unlikePoem, saveToCollection, removeFromCollection } from '@/lib/api/poem'
import CommentSection from './CommentSection'
import PoemCarousel from './PoemCarousel'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks'
import { selectIsAuthenticated, selectToken } from '@/lib/store/auth/authSlice'
import { updatePoem } from '@/lib/store/poem/poemFeedSlice'
import { removePoemFromCollection, resetCollection } from '@/lib/store/collection/collectionSlice'
import { Poem } from '@/types/poem'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/navigation'

const PostCard = ({ className, poemData }: { className: string, poemData: Poem }) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [showComments, setShowComments] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSavePoem = async () => {
    if (!isAuthenticated || !token) {
      router.push('/sign-in')
      return
    }
    try {
      await saveToCollection(poemData.id, token)
      dispatch(updatePoem({
        id: poemData.id, 
        updates: { 
          is_saved: true,
          save_count: (poemData.save_count || 0) + 1
        }
      }))
      dispatch(resetCollection())
    } catch (error) {
      console.error("Error saving to collection:", error)
    }
  }

  const handleUnsavePoem = async () => {
    if (!isAuthenticated || !token) {
      alert("You must be logged in to remove a poem.")
      return
    }
    try {
      await removeFromCollection(poemData.id, token)
      dispatch(updatePoem({
        id: poemData.id, 
        updates: { 
          is_saved: false,
          save_count: Math.max((poemData.save_count || 0) - 1, 0)
        }
      }))
      dispatch(removePoemFromCollection(poemData.id))
    } catch (error: unknown) {
      let message = "Error removing poem from collection."

      if (isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message
      }
      alert(message)
    }

  }

  const handleLikePoem = async () => {
    if (!isAuthenticated || !token) {
      router.push('/sign-in')
      return
    }
    try {
      await likePoem(poemData.id, token)
      dispatch(updatePoem({
        id: poemData.id,
        updates: {
          is_liked: true,
          like_count: (poemData.like_count || 0) + 1
        }
      }))
    } catch (error) {
      console.error("Error liking poem:", error)
    }
  }

  const handleUnlikePoem = async () => {
    if (!isAuthenticated || !token) {
      router.push('/sign-in')
      return
    }
    try {
      await unlikePoem(poemData.id, token)
      dispatch(updatePoem({
        id: poemData.id,
        updates: {
          is_liked: false,
          like_count: Math.max((poemData.like_count || 0) - 1, 0)
        }
      }))
    } catch (error) {
      console.error("Error unliking poem:", error)
    }
  }

  const handleCommentClick = () => {
    setShowComments(!showComments)
  }

  const handleCreatePoem = async () => {
    // const formData = new FormData()
    // formData.append("genre_id", "1")
    // formData.append("prompt", poemData.prompt)
    // formData.append("title", poemData.title)
    // formData.append("content", poemData.content)
    // formData.append("note", poemData.note || "")
    // formData.append("tags", poemData.tags || "")
    // formData.append("is_public", "false")
    // if (image instanceof File) {
    //   formData.append("image", image)
    // }
    // try {
    //   const token = localStorage.getItem("token")
    //   if (!token) {
    //     alert("You must be logged in to create a poem.")
    //     return
    //   }
    //   const response = await createPoem(token, formData)
    //   if (response !== null) {
    //     alert("Poem created successfully")
    //     router.push('/')
    //   } else {
    //     alert("Tạo poem thất bại!")
    //   }
    // } catch (error: any) {
    //   if (error.response && error.response.data && error.response.data.message) {
    //     alert(error.response.data.message)
    //   } else {
    //     alert("Đã có lỗi xảy ra khi tạo poem.")
    //   }
    // }
  }

  return (
    <div className={`${className} post-card bg-white rounded-2xl relative w-full overflow-hidden vi-shadow`}>
      <div className="post-header px-2 pt-2 flex justify-between mt-1 mb-2">
        <div className="info-box flex">
          <UserAvatar
            id={'post-avatar'}
            className={"w-10 h-10 cursor-pointer mr-2"}
            src={poemData.avt_url}
            alt={poemData.user_name}
            fallbackText={poemData.user_name.charAt(0).toUpperCase() || "U"}
          />
          <div className="info-text flex-1">
            <div className="flex items-center">
              <span className="username vi-text-primary text-15px font-semibold flex items-center">{poemData.user_name}</span>
              <span className="mx-2 text-gray-400 text-sm">·</span>
              <span className="time vi-text-second text-sm">{timeAgo(poemData.created_at)}</span>
              {poemData.is_public
                ? <Globe size={16} className="ml-2 vi-text-second" />
                : <GlobeLock size={16} className="ml-2 vi-text-second"/>
              }
            </div>
            <div className="post-description">
              <p className="note text-15px leading-[1.3]">{ poemData.note }</p>
              <div className="tags leading-[1]">
                {poemData.tags && poemData.tags.map(tag => (
                  <Link 
                    key={tag.id} 
                    className="text-sm font-semibold me-1" 
                    href={{
                      pathname: '/search',
                      query: { tags: '#' + tag.name }
                    }} 
                  >#{tag.name}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="addition-btn absolute top-2 right-2 z-1">
        <button
          type="button"
          className="vi-button"
          onClick={() => {/* mở menu hoặc xử lý mở rộng ở đây */}}
        >
          <MoreVertical size={16} className="text-gray-600 group-hover:text-black transition-colors" />
        </button>
      </div>
      
      <PoemCarousel poemData={poemData} />

      {/* <div className="relative group mx-6 py-6 text-center rounded-lg hover:bg-gray-100 transition-colors duration-200  border hidden"
        style={{
          backgroundImage: `url('${preview}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#000",
        }}
      >
        {
          editMode ? (
            <>
            <div className='absolute flex right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                <button
                  type='button'
                  className='me-2 bg-white p-1 rounded-md border border-gray-200 text-sm text-gray-700 cursor-pointer hover:opacity-75'
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='bg-black p-1 rounded-md text-sm text-white cursor-pointer hover:opacity-75'
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="post-title text-xl font-bold mb-2 text-center outline-none"
              />
              <AutoResizeTextarea
                editedContent={editedContent}
                setEditedContent={setEditedContent}
              />
            </>
          ) : (
            <>
              <button
                type='button'
                className='absolute right-2 top-2 p-1 rounded-md cursor-pointer hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                onClick={() => setEditMode(true)}
              >
                <SquarePen size={20} className='text-gray-600' />
              </button>
              <p className="post-title text-xl font-bold mb-2">{poemData.title}</p>
              <p className="text-base whitespace-pre-wrap">{`${poemData.content}`}</p>
            </>
          )
        }
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAvatarChange}
        />
      </div> */}
      <InteractionBox 
        editMode={false}
        isLiked={poemData.is_liked}
        isSaved={poemData.is_saved}
        likeCount={poemData.like_count}
        commentCount={poemData.comment_count}
        saveCount={poemData.save_count}
        onLikePoem={handleLikePoem}
        onUnlikePoem={handleUnlikePoem}
        onCreatePoem={handleCreatePoem}
        onAddImage={() => fileInputRef.current?.click()}
        onSavePoem={handleSavePoem}
        onUnsavePoem={handleUnsavePoem}
        onCommentClick={handleCommentClick}
      />
      <CommentSection
        poemId={poemData.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  )
}

export default PostCard;