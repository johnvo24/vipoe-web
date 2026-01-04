'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Globe, GlobeLock, MoreVertical, Plus } from 'lucide-react'
import UserAvatar from '@/components/ui/avatar'
import Image from 'next/image'
import { timeAgo } from '@/lib/utils'
import Link from 'next/link'
import InteractionBox from './InteractionBox'
import { likePoem, unlikePoem, saveToCollection, removeFromCollection } from '@/lib/api/poem'
import CommentSection from './CommentSection'
import PoemCarousel from './PoemCarousel'
import { ProfilePreviewDialog } from '@/components/post/ProfilePreviewDialog'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks'
import { selectIsAuthenticated, selectToken, selectUserId } from '@/lib/store/auth/authSlice'
import { updatePoem } from '@/lib/store/poem/poemFeedSlice'
import { removePoemFromCollection, resetCollection } from '@/lib/store/collection/collectionSlice'
import { Poem } from '@/types/poem'
import { User } from '@/types/auth'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { getUserById } from '@/lib/api/auth'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from '@/components/ui/button'

const PostCard = ({ className, poemData }: { className: string, poemData: Poem }) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [showComments, setShowComments] = useState(false)
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [userLoading, setUserLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const currentUserId = useAppSelector(selectUserId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!poemData.user_id) return
      setUserLoading(true)
      try {
        const user = await getUserById(poemData.user_id, token || undefined)
        setUserInfo(user)
      } catch (error) {
        // Handle error if needed
      } finally {
        setUserLoading(false)
      }
    }
    fetchUserInfo()
  }, [poemData.user_id, token])

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
    <div className={`${className} post-card bg-[#ffffff] rounded-2xl relative w-full overflow-hidden vi-shadow`}>
      <div className="post-header px-2 pt-2 flex justify-between mt-1 mb-2">
        <div className="info-box flex">
          <div
            className="relative inline-block w-10 h-10 me-2 group"
          >
            {/* Avatar */}
            <UserAvatar
              id={'post-avatar'}
              className={"w-10 h-10 cursor-pointer"}
              src={poemData.avt_url}
              alt={poemData.user_name}
              fallbackText={poemData.user_name.charAt(0).toUpperCase() || "U"}
              onClick={() => setOpen(true)}
            />
            {/* Plus button */}
            {userInfo && userInfo.id !== currentUserId && (
              userInfo.is_following ? (
                null
              ) : (
                <button
                  type="button"
                  className="
                    absolute -bottom-1 -right-1
                    h-5 w-5 rounded-full
                    bg-black text-white
                    flex items-center justify-center
                    border-2 border-white
                    scale-90
                    transition-all duration-200
                    group-hover:scale-110
                  "
                  onClick={() => setOpen(true)}
                >
                  <Plus size={12} strokeWidth={2.5} />
                </button>
              )
            )}
            <ProfilePreviewDialog
              open={open}
              onOpenChange={setOpen}
              avatarUrl={poemData.avt_url}
              name={userInfo?.full_name || "Người dùng"}
              username={poemData.user_name}
              bio={userInfo?.bio || "No bio available"}
              followers={userInfo?.followers_count || 0}
              is_following={userInfo?.is_following || false}
            />
          </div>
          <div className="info-text flex-1">
            <div className="flex items-center">
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger>
                  <span className="username vi-text-primary text-15px font-semibold flex items-center cursor-pointer hover:underline">
                    {poemData.user_name}
                  </span>
                </HoverCardTrigger>
                {!isAuthenticated || !token ? null : (
                  <HoverCardContent align='start' className='rounded-xl min-w-80'>
                    {userLoading ? (
                      <div className="flex justify-center items-center p-4">
                        <p>Loading...</p>
                      </div>
                    ) : userInfo ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-xl font-bold">{userInfo.full_name || "Người dùng"}</h1>
                          <p className="text-black">@{userInfo.username}</p>
                        </div>
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
                          <Image
                            src={userInfo.avt_url || "/images/st-mtp.jpg"}
                            alt="Profile"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <h1 className="text-xl font-bold">{"Người dùng"}</h1>
                          <p className="text-[15px] font-normal">@{"username"}</p>
                        </div>
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
                          <Image
                            src={"/images/st-mtp.jpg"}
                            alt="Profile"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {userInfo && (
                      <div className='space-y-1.5'>
                        <p className='text-[15px] font-normal'>{userInfo.bio || "No bio available"}</p>
                        <p className='text-[15px] font-normal text-muted-foreground'>{userInfo.followers_count || 0} followers</p>
                        {userInfo.id !== currentUserId && (
                          userInfo.is_following ? (
                            <Button className="mt-1.5 py-2 w-full border bg-white text-black font-semibold rounded-lg hover:bg-gray-100 cursor-pointer">
                              Unfollow
                            </Button>
                          ) : (
                            <Button className="mt-1.5 py-2 w-full bg-black text-white font-semibold rounded-lg cursor-pointer">
                              Follow
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </HoverCardContent>
                )}
              </HoverCard>
              <span className="mx-2 text-gray-400 text-sm">·</span>
              <span className="time vi-text-second text-sm">{timeAgo(poemData.created_at)}</span>
              {poemData.is_public
                ? <Globe size={16} className="ml-2 vi-text-second" />
                : <GlobeLock size={16} className="ml-2 vi-text-second" />
              }
            </div>
            <div className="post-description">
              <p className="note text-15px leading-[1.3]">{poemData.note}</p>
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
          onClick={() => {/* mở menu hoặc xử lý mở rộng ở đây */ }}
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