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

  return (
    <div className={`${className} post-card p-2 bg-white rounded-lg mx-2 vi-border`}>
      <div className="post-header flex justify-between m-1">
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
            <p className="note text-15px -mt-0.5">{ poemData.note } Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus repudiandae pariatur ullam? Veritatis itaque vel, incidunt facilis numquam libero molestias unde amet consequuntur aliquid doloremque totam dolor! Excepturi, ex sed?</p>
          </div>
        </div>
        <button
          type="button"
          className="vi-button self-start"
          onClick={() => {/* mở menu hoặc xử lý mở rộng ở đây */}}
        >
          <MoreVertical size={16} className="text-gray-600 group-hover:text-black transition-colors" />
        </button>
      </div>
      <div
        className="relative group mx-6 py-6 text-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
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
      <div className="interaction-box flex mt-2 rounded-lg border">
        {
          pathname === '/write' ? (
            <>
              <button onClick={handleCreatePoem} className="action-btn flex flex-1 items-center justify-center space-x-2 hover:bg-gray-200 p-2 rounded-md">
                <Download className="text-gray-600" size={20} />
                <span className="text-start text-gray-700 font-medium">Save</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="action-btn flex flex-1 items-center justify-center space-x-2 hover:bg-gray-200 p-2 rounded-md">
                <ImagePlus className="text-gray-600" size={20} />
                <span className="text-start text-gray-700 font-medium">Add Image</span>
              </button>
            </>
          ) : (
            <>
              {/* Nút Like */}
              <button className="action-btn flex flex-1 items-center justify-center space-x-2 hover:bg-gray-200 p-2 rounded-md">
                <Heart className="text-gray-600" size={20} />
                {/* <FaHeart className="text-red-500" size={20} /> */}
                <span className="w-16 text-start text-gray-700 font-medium">120</span>
              </button>

              {/* Nút Save */}
              {
                user?.id === poemData.user_id ? (
                  <button onClick={handleRemoveFromCol} className="action-btn bg-red-400 flex flex-1 items-center justify-center space-x-2 hover:opacity-75 p-2 rounded-md">
                    <BookmarkMinus className="text-gray-100" size={20} />
                    {/* <FaBookmark className="text-yellow-500" size={20} /> */}
                    <span className="w-16 text-start text-gray-100 font-medium">Remove</span>
                  </button>
                ) : (
                  <button onClick={handleSaveToCol} className="action-btn flex flex-1 items-center justify-center space-x-2 hover:bg-gray-200 p-2 rounded-md">
                    <Bookmark className="text-gray-600" size={20} />
                    {/* <FaBookmark className="text-yellow-500" size={20} /> */}
                    <span className="w-16 text-start text-gray-700 font-medium">45</span>
                  </button>
                )
              }

              {/* Nút Share */}
              <button className="action-btn flex flex-1 items-center justify-center space-x-2 hover:bg-gray-200 p-2 rounded-md">
                <Forward className="text-gray-600" size={21} />
                <span className="text-start text-gray-700 font-medium">Share</span>
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}

export default PostCard;