'use client'

import React, { useState, useRef } from 'react'
import useAuth from "@/lib/hooks/useAuth"
import AutoResizeTextarea from '@/components/autoresize-textarea'
import { Focus, Bookmark, Heart, Forward, Download, BookmarkMinus, ImagePlus, SquarePen, Globe, Lock, GlobeLock, MoreVertical } from 'lucide-react'
import { useRouter, usePathname } from "next/navigation"
import { api } from "@/lib/services"
import { API_ROUTES } from "@/lib/routes"
import UserAvatar from '@/components/ui/avatar'
import { timeAgo } from '@/lib/utils'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import InteractionBox from './InteractionBox'

const PostCard = ({ className, poemData }: { className: string, poemData: any }) => {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(poemData.image_url || "/images/default-image.png")
  const [editMode, setEditMode] = useState(false)
  const [editedTitle, setEditedTitle] = useState(poemData.title)
  const [editedContent, setEditedContent] = useState(poemData.content)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const handleSaveToCol = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.post(API_ROUTES.CRUD_COLLECTION + `${poemData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.status === 200 || response.status === 201) {
        alert("Poem added to collection successfully")
      }
    } catch (error) {
      alert(error)
    }
  }

  const handleRemoveFromCol = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.delete(API_ROUTES.CRUD_COLLECTION + `${poemData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.status === 200 || response.status === 204) {
        alert("Poem removed to collection successfully")
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message)
      } else {
        alert("Đã có lỗi xảy ra khi xóa khỏi bộ sưu tập.")
      }
    }
  }

  // Hàm để tạo một bài thơ mới
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
      const response = await api.post(API_ROUTES.CRUD_POEM, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      if (response && (response.status === 201 || response.status === 200)) {
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }
  
  const handleSave = () => {
    poemData.title = editedTitle
    poemData.content = editedContent
    setEditMode(false)
  }

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    dragFree: false,
    containScroll: 'trimSnaps',
  })

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
      <div className="poem-box scrollbar-hidden overflow-hidden ps-14 pe-[22px]"
        ref={emblaRef}
      >
        <div className="poem-content flex gap-2">
          {[1, 2, 3, 4, 5].map((item, idx) => (
            <div
              key={idx}
              className="keen-slider__slide relative w-[264px] sm:w-[480px] max-h-[480px] rounded-lg overflow-hidden flex-shrink-0 vi-border"
            >
              <img
                src={poemData.image_url || "/images/bg-stmpt.jpg"}
                alt="Image"
                loading="lazy"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-white/15 flex flex-col justify-center items-center p-3 z-10">
                <p className="font-bold text-base mb-2 text-center truncate">{poemData.title}</p>
                <p className="text-sm text-gray-700 text-center whitespace-pre-wrap overflow-hidden line-clamp-4">
                  {poemData.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative group mx-6 py-6 text-center rounded-lg hover:bg-gray-100 transition-colors duration-200  border hidden"
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
      </div>
      <InteractionBox 
        editMode={false} 
        isLiked={false} 
        isSaved={false} 
      />
    </div>
  )
}

export default PostCard;