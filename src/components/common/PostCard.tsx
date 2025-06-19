'use client'

import UserAvatar from "../ui/avatar"
import useAuth from "@/lib/hooks/useAuth"
import { Focus, Bookmark, Heart, Forward, Download, BookmarkMinus } from 'lucide-react'
import { useRouter, usePathname } from "next/navigation"
import { api } from "@/lib/services"
import { API_ROUTES } from "@/lib/routes"

const PostCard = ({ className, poemData }: { className: string, poemData: any }) => {
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
    if (poemData.image instanceof File) {
      formData.append("image", poemData.image)
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

  return (
    <div className={`${className} post-card p-1 bg-white rounded-lg mx-2 vi-border`}>
      <div className="post-header flex justify-between p-1">
        <div className="info-box flex">
          <UserAvatar
            id={'post-avatar'}
            className={"w-9 h-9 cursor-pointer mr-4"}
            src={poemData.avt_url}
            alt={poemData.user_name}
            fallbackText={poemData.user_name.charAt(0).toUpperCase() || "U"}
          />
          <div className="info-text">
            <p className="username text-base font -mb-1">{poemData.user_name}</p>
            <p className="time text-gray-500 text-sm">{poemData.created_at}</p>
          </div>
        </div>
        <Focus
          className="cursor-pointer rounded-lg hover:bg-gray-200"
          size={36}
          onClick={() => router.push('/view')}
        />
      </div>
      <div
        className="p-6 text-center rounded-lg"
        style={{
          backgroundImage: `url('${poemData.image_url}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#000",
        }}
      >
        <p className="post-title text-xl font-bold mb-2">{poemData.title}</p>
        <p className="text-base whitespace-pre-wrap">{`${poemData.content}`}</p>
      </div>
      <div className="interaction-box flex mt-2 rounded-lg border">
        {
          pathname === '/write' ? (
            <button onClick={handleCreatePoem} className="action-btn flex flex-1 items-center justify-center space-x-2 hover:bg-gray-200 p-2 rounded-md">
              <Download className="text-gray-600" size={20} />
              <span className="text-start text-gray-700 font-medium">Save</span>
            </button>
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