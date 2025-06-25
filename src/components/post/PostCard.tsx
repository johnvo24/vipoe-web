'use client'

import React, { useState, useRef } from 'react'
import useAuth from "@/lib/hooks/useAuth"
import AutoResizeTextarea from '@/components/autoresize-textarea'
import { Focus, Bookmark, Heart, Forward, Download, BookmarkMinus, ImagePlus, SquarePen, Globe, Lock, GlobeLock, MoreVertical } from 'lucide-react'
import { useRouter, usePathname } from "next/navigation"
import UserAvatar from '@/components/ui/avatar'
import { timeAgo } from '@/lib/utils'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import InteractionBox from './InteractionBox'
import { saveToCollection, createPoem, removeFromCollection } from '@/lib/api/poem'
import PoemCarousel from './PoemCarousel'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks'
import { selectIsAuthenticated, selectToken } from '@/lib/store/auth/authSlice'
import { updatePoem } from '@/lib/store/poem/poemFeedSlice'
import { removePoemFromCollection, resetCollection } from '@/lib/store/collection/collectionSlice'

const PostCard = ({ className, poemData }: { className: string, poemData: any }) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(poemData.image_url || "/images/default-image.png")
  const [editMode, setEditMode] = useState(false)
  const [editedTitle, setEditedTitle] = useState(poemData.title)
  const [editedContent, setEditedContent] = useState(poemData.content)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSavePoem = async () => {
    if (!isAuthenticated || !token) {
      alert("Not logged in!")
      return
    }
    try {
      const response = await saveToCollection(poemData.id, token)
      dispatch(updatePoem({id: poemData.id, updates: { is_saved: true }}))
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
      dispatch(updatePoem({id: poemData.id, updates: { is_saved: false }}))
      dispatch(removePoemFromCollection(poemData.id))
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error removing poem from collection."
      alert(message)
    }
  }

  const handleCreatePoem = async () => {
    const formData = new FormData()
    formData.append("genre_id", "1")
    formData.append("prompt", poemData.prompt)
    formData.append("title", poemData.title)
    formData.append("content", poemData.content)
    formData.append("note", poemData.note || "")
    formData.append("tags", poemData.tags || "")
    formData.append("is_public", "false")
    if (image instanceof File) {
      formData.append("image", image)
    }
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("You must be logged in to create a poem.")
        return
      }
      const response = await createPoem(token, formData)
      if (response !== null) {
        alert("Poem created successfully")
        router.push('/')
      } else {
        alert("Tạo poem thất bại!")
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message)
      } else {
        alert("Đã có lỗi xảy ra khi tạo poem.")
      }
    }
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
              <p className="note text-15px leading-[1.3]">{ poemData.note } Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus repudiandae pariatur ullam? Veritatis itaque vel.</p>
              <div className="tags leading-[1]">
                <Link className="text-sm font-semibold me-1" href={'#'} >#quê hương</Link>
                <Link className="text-sm font-semibold me-1" href={'#'} >#tình yêu</Link>
                <Link className="text-sm font-semibold me-1" href={'#'} >#học đường</Link>
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
        isLiked={false}
        isSaved={poemData.is_saved}
        onLikePoem={() => {}}
        OnUnlikePoem={() => {}}
        onCreatePoem={handleCreatePoem}
        onAddImage={() => fileInputRef.current?.click()}
        onSavePoem={handleSavePoem}
        onUnsavePoem={handleUnsavePoem}
      />
    </div>
  )
}

export default PostCard;