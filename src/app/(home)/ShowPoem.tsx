"use client"

import React, { useEffect, useCallback, useState } from 'react'
import PostCard from '@/components/post/PostCard'
import { useAppSelector, useAppDispatch } from '@/lib/hooks/reduxHooks'
import { fetchPoemFeed } from '@/lib/store/poem/poemFeedThunks'
import { selectPoems, selectPoemFeedLoading, selectPoemFeedError, selectIsInitialLoading, selectHasMore, selectOffset, resetFeed } from '@/lib/store/poem/poemFeedSlice'
import { useRouter } from 'next/navigation'
import { selectAuthLoading, selectToken } from '@/lib/store/auth/authSlice'
import throttle from 'lodash.throttle'

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
  const [showScrollToTop, setShowScrollToTop] = useState(false)

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const handleScroll = throttle(() => {
      // Load more poems
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        loadMorePoems()
      }

      // Show scroll-to-top button
      const shouldShowButton = poems.length > 5 && window.pageYOffset > 800
      setShowScrollToTop(shouldShowButton)
    }, 100) 

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMorePoems, poems.length])

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

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={"fixed bottom-12 sm:bottom-6 sm:right-0 bg-gray-800/35 hover:bg-gray-700 text-white p-3 mx-0 sm:mx-6 rounded-full hover:scale-105 z-20 cursor-pointer" + (showScrollToTop ? "" : " hidden")}
        aria-label="Scroll to top"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </button>
    </>
  )
}

export default ShowPoem