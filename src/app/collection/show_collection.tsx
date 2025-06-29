"use client"

import React, { useEffect, useCallback } from 'react'
import PostCard from '@/components/post/PostCard'
import { useAppSelector, useAppDispatch } from '@/lib/hooks/reduxHooks'
import { fetchCollection } from '@/lib/store/collection/collectionThunks'
import { 
  selectCollectionPoems, 
  selectCollectionLoading, 
  selectCollectionError, 
  selectCollectionIsInitialLoading, 
  selectCollectionHasMore, 
  selectCollectionOffset, 
} from '@/lib/store/collection/collectionSlice'
import { useRouter } from 'next/navigation'
import { selectAuthLoading, selectToken } from '@/lib/store/auth/authSlice'

const ShowCollection = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
  const poems = useAppSelector(selectCollectionPoems)
  const collectionLoading = useAppSelector(selectCollectionLoading)
  const authLoading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectCollectionError)
  const isInitialLoading = useAppSelector(selectCollectionIsInitialLoading)
  const hasMore = useAppSelector(selectCollectionHasMore)
  const offset = useAppSelector(selectCollectionOffset)
  const router = useRouter()

  useEffect(() => {
    if (isInitialLoading && !authLoading) {
      dispatch(fetchCollection({ offset: 0, limit: 10, reset: true }))
    }
  }, [dispatch, isInitialLoading, token, authLoading])

  useEffect(() => {
    if (error === 'LOGGED_OUT' || error === 'NOT_AUTH') {
      router.push('/sign-in')
    }
    if (error && error !== 'LOGGED_OUT' && error !== 'NOT_AUTH') {
      console.error('Fetch Collection Error:', error)
    }
  }, [error, router])

  const loadMorePoems = useCallback(() => {
    if (!isInitialLoading && !collectionLoading && hasMore) {
      dispatch(fetchCollection({ offset: Number(offset), limit: 10, reset: false }))
    }
  }, [dispatch, collectionLoading, hasMore, offset, isInitialLoading])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePoems()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMorePoems])

  if (collectionLoading && poems.length === 0) {
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
      
      {collectionLoading && poems.length > 0 && (
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

export default ShowCollection