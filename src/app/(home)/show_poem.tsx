"use client"

import React, { useEffect, useCallback } from 'react'
import PostCard from '@/components/post/PostCard'
import { useAppSelector, useAppDispatch } from '@/lib/hooks/reduxHooks'
import { fetchPoemFeed } from '@/lib/store/poem/poemFeedThunks'
import { selectPoems, selectPoemFeedLoading, selectPoemFeedError, selectIsInitialLoading, selectHasMore, selectOffset, resetFeed } from '@/lib/store/poem/poemFeedSlice'
import { useRouter } from 'next/navigation'
import { selectAuthLoading, selectToken } from '@/lib/store/auth/authSlice'

const ShowPoem = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
  const poems = useAppSelector(selectPoems)
  const poemFeedLoading = useAppSelector(selectPoemFeedLoading)
  const authLoading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectPoemFeedError)
  const isInitialLoading = useAppSelector(selectIsInitialLoading)
  const hasMore = useAppSelector(selectHasMore)
  const offset = useAppSelector(selectOffset)
  const router = useRouter()

  useEffect(() => {
    if (isInitialLoading && !authLoading) {
      dispatch(fetchPoemFeed({ offset: 0, limit: 10, reset: true }))
    }
  }, [dispatch, isInitialLoading, token, authLoading])

  useEffect(() => {
    if (error === 'LOGGED_OUT') {
      dispatch(resetFeed())
    }
    if (error && error !== 'LOGGED_OUT') {
      console.error('Fetch Poem Error:', error)
    }
  }, [dispatch, error, router])

  const loadMorePoems = useCallback(() => {
    if (!isInitialLoading && !poemFeedLoading && hasMore) {
      dispatch(fetchPoemFeed({ offset: Number(offset), limit: 10, reset: false }))
    }
  }, [dispatch, isInitialLoading, poemFeedLoading, hasMore, offset])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePoems()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMorePoems])

  if (poemFeedLoading && poems.length === 0) {
    return (
      <header className="flex justify-center p-4 shadow-md">
        <span>Loading...</span>
      </header>
    )
  }

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
      
      {poemFeedLoading && poems.length > 0 && (
        <div className="flex justify-center p-4">
          <span>Loading more poems...</span>
        </div>
      )}
      
      {!hasMore && poems.length > 0 && (
        <div className="flex justify-center p-4">
          <span className="text-gray-500">No more poems to load</span>
        </div>
      )}
    </>
  )
}

export default ShowPoem