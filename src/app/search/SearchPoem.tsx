"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import PostCard from '@/components/post/PostCard'
import SearchForm from '@/components/search/SearchForm'
import { searchPoems } from '@/lib/api/poem'
import { useAppSelector } from '@/lib/hooks/reduxHooks'
import { selectToken } from '@/lib/store/auth/authSlice'
import { Poem } from '@/types/poem'
import { poemGenres } from '@/lib/constants/poem_constant'

const SearchPoem = () => {
  const searchParams = useSearchParams()
  const token = useAppSelector(selectToken)
  
  const [poems, setPoems] = useState<Poem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const keyword = searchParams.get('keyword') || undefined
  const tags = searchParams.get('tags') || undefined
  const genre_id = searchParams.get('genre_id') ? parseInt(searchParams.get('genre_id')!) : undefined
  
  const hasSearchParams = keyword || tags || genre_id

  // Get genre name from genre_id
  const getGenreName = (genreId: number | undefined) => {
    if (genreId === undefined) return undefined
    return poemGenres.find(genre => genre.id === genreId)?.name
  }

  const searchPoems_API = useCallback(async (resetList = false) => {
    if (loading || !hasSearchParams) return
    setLoading(true)
    setError(null)
    
    try {
      const currentOffset = resetList ? 0 : offset
      const results = await searchPoems(keyword, tags, genre_id, currentOffset, 20, token)
      
      if (resetList) {
        setPoems(results)
        setOffset(results.length)
      } else {
        setPoems(prev => [...prev, ...results])
        setOffset(prev => prev + results.length)
      }
      
      setHasMore(results.length === 20)
    } catch (err) {
      console.error('Error searching poems:', err)
      setError('Failed to search poems. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [keyword, tags, genre_id, token, offset, loading, hasSearchParams])

  // Reset and search when search params change
  useEffect(() => {
    if (hasSearchParams) {
      setPoems([])
      setOffset(0)
      setHasMore(true)
      searchPoems_API(true)
    } else {
      setPoems([])
      setOffset(0)
      setHasMore(true)
    }
  }, [keyword, tags, genre_id, token, hasSearchParams, searchPoems_API])

  // Load more poems on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 1000
        && hasMore && !loading && hasSearchParams
      ) {
        searchPoems_API(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [searchPoems_API, hasMore, loading, hasSearchParams])

  return (
    <div>
      <SearchForm />
      {/* Tips */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
        <div className="flex items-start gap-2">
          <span className="text-blue-500">💡</span>
          <div>
            <p className="font-medium text-gray-700 mb-1">Search Tips:</p>
            <ul className="space-y-1">
              <li>• Use # for tags: <code className="bg-gray-200 px-1 rounded">&#34;#tình_yêu #quê_hương&#34;</code></li>
              <li>• Combine keywords and tags: <code className="bg-gray-200 px-1 rounded">&#34;Vầng trăng #tình_yêu #nỗi_nhớ&#34;</code></li>
              <li>• Use the filter button to access genre selection</li>
            </ul>
          </div>
        </div>
      </div>
      
      {!hasSearchParams ? (
        <div className="text-center p-8">
          <p className="text-gray-500 text-lg">Enter search criteria above to find poems</p>
        </div>
      ) : (
        <>
          {/* Search summary */}
          <div className="mt-2 mb-4 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Search Results</h2>
            {keyword && <p className="text-sm text-gray-600">• Keyword: &#34;{keyword}&#34;</p>}
            {tags && <p className="text-sm text-gray-600">• Tags: {tags}</p>}
            {genre_id && <p className="text-sm text-gray-600">• Genre: {getGenreName(genre_id)}</p>}
            <p className="text-sm text-gray-500 mt-1">Found {poems.length} poems</p>
          </div>

          {loading && poems.length === 0 && (
            <div className="flex justify-center p-4">
              <span>Searching poems...</span>
            </div>
          )}

          {error && (
            <div className="flex justify-center p-4">
              <span className="text-red-500">{error}</span>
            </div>
          )}

          {/* Search results */}
          {!loading && !error && poems.length === 0 && (
            <div className="text-center p-8">
              <p className="text-gray-500 text-lg">No poems found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search criteria or browse all poems
              </p>
            </div>
          )}

          {poems.length > 0 && (
            <>
              {poems.map(poem => (
                <PostCard 
                  key={poem.id}
                  className='mb-4'
                  poemData={poem}
                />
              ))}
              
              {loading && (
                <div className="flex justify-center p-4">
                  <span>Loading more poems...</span>
                </div>
              )}
              
              {!hasMore && (
                <div className="flex justify-center p-4">
                  <span className="text-gray-500">No more poems to load</span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default SearchPoem