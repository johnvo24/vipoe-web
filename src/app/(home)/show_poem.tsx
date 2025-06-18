"use client"

import React, { useState, useEffect } from 'react'
import PostCard from '@/components/ui/post-card'
import { useAppSelector } from '@/lib/hooks/reduxHooks'
import { getPoemFeed } from '@/lib/api/poem'

const ShowPoem = () => {
  const [poems, setPoems] = useState<any[]>([])
  const user = useAppSelector((state) => state.auth.user)
  // const loadingUser = useAppSelector((state) => state.auth.loading)

  const fetchData = async () => {
    try {
      const poemData = await getPoemFeed(0, 20)
      setPoems(poemData)
    } catch (error) {
      console.error("Failed to fetch poems:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  // if (loading) {
  //   return (
  //     <header className="flex justify-center p-4 shadow-md">
  //       <span>Loading...</span>
  //     </header>
  //   )
  // }

  return (
    <>
      {poems.length === 0 ? (
          <p>No poems found.</p>
        ) : (
          poems.map(poem => (
            <PostCard 
              key={poem.id}
              className='mb-4'
              poemData={poem}
            />
          ))
        )}
    </>
  )
}

export default ShowPoem