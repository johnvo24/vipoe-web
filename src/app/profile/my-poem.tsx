"use client"

import React, { useState, useEffect } from 'react'
import PostCard from '@/components/post/PostCard'
import Image from 'next/image'
import CreatePoemPost from '@/app/profile/create-poem-post'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserPoems } from '@/lib/api/poem'
import { useAppSelector } from '@/lib/hooks/reduxHooks'
import { selectAuthLoading, selectUser } from '@/lib/store/auth/authSlice'
import { Button } from '@/components/ui/button'
import { Poem } from '@/types/poem'

const MyPoem = () => {
  const [poems, setPoems] = useState<Poem[]>([])
  const [message, setMessage] = useState<string>('')
  const user = useAppSelector(selectUser)
  const loading = useAppSelector(selectAuthLoading)

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await getUserPoems(token)
          setPoems(response)
        } else {
          console.error('No token found in localStorage')
        }
      } catch (error) {
        setMessage('An error occurred while fetching poems. Please try again later.')
        console.error('Error fetching poems:', error)
      }
    }
    if (user) {
      fetchPoems()
    }
  }, [user])

  if (loading) {
    return (
      <div className='content mx-auto w-8/12 min-w-[960px] py-4'>
        <Skeleton className='h-52' />
      </div>
    )
  }

  return (
    <div className="content">
      <div className='mb-2 flex justify-between items-center'>
        <div className='flex items-center'>
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/20">
            <Image
              src={user?.avt_url || "/images/st-mtp.jpg"}
              alt="Profile"
              width={200} // hoặc kích thước phù hợp
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          <p className='ms-4 text-[#999]'>Have an idea?</p>
        </div>
        <CreatePoemPost />
      </div>
      {poems.length === 0 ? (
        <p>{message}</p>
      ) : (
        poems.map(poem => (
          <PostCard
            key={poem.id}
            className='mb-4'
            poemData={poem}
          />
        ))
      )}
    </div>
  )
}

export default MyPoem