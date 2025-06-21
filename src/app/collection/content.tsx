"use client"

import React, { useState, useEffect } from 'react'
import useAuth from '@/lib/hooks/useAuth'
import PostCard from '@/components/post/PostCard'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { getPoemInCollection } from '@/lib/api/poem'

const Content = () => {
  const [poems, setPoems] = useState<any[]>([])
  const [message, setMessage] = useState<string>('')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await getPoemInCollection(token)
          setPoems(response)
        } else {
          alert('You need to login to view your poems.')
        }
      } catch (error) {
        setMessage('An error occurred while fetching poems. Please try again later.')
        setPoems([])
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
        <Skeleton className='h-52 mt-4' />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">You need to login to write a poem</h1>
        <Button onClick={() => router.push("/sign-in")} className="mt-4">
          Click here
        </Button>
      </div>
    )
  }

  return (
    <div className="content mx-auto w-8/12 min-w-[960px] py-4">
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

export default Content