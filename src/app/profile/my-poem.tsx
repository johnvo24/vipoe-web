"use client"

import React, { useState, useEffect } from 'react'
import useAuth from '@/lib/hooks/useAuth'
import PostCard from '@/components/post/PostCard'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/services'
import { API_ROUTES } from '@/lib/routes'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { set } from 'zod'

const MyPoem = () => {
  const [poems, setPoems] = useState<any[]>([])
  const [message, setMessage] = useState<string>('')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await api.get(API_ROUTES.CRUD_POEM, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setPoems(response.data)
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