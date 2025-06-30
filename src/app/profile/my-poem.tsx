"use client"

import React, { useState, useEffect } from 'react'
import PostCard from '@/components/post/PostCard'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserPoems } from '@/lib/api/poem'
import { useAppSelector } from '@/lib/hooks/reduxHooks'
import { selectAuthLoading, selectUser } from '@/lib/store/auth/authSlice'
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