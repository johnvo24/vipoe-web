"use client"
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter } from 'lucide-react'
import { poemGenres } from '@/lib/constants/poem_constant'

const SearchFormContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Combine keyword and tags into single search input
  const [searchInput, setSearchInput] = useState(() => {
    const keyword = searchParams.get('keyword') || ''
    const tags = searchParams.get('tags') || ''
    return keyword + (tags ? ' ' + tags : '')
  })
  const [genreId, setGenreId] = useState(searchParams.get('genre_id') || '')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const parseSearchInput = (input: string) => {
    const trimmedInput = input.trim()
    if (!trimmedInput) return { keyword: '', tags: '' }

    const hashtagRegex = /#[\p{L}\p{N}_]+/gu
    const hashtags = trimmedInput.match(hashtagRegex) || []
    
    const keyword = trimmedInput.replace(hashtagRegex, '').replace(/\s+/g, ' ').trim()
    const tags = hashtags.join('')

    return { keyword, tags }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const { keyword, tags } = parseSearchInput(searchInput)
    
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (tags) params.set('tags', tags)
    if (genreId.trim()) params.set('genre_id', genreId.trim())
    
    setShowPreview(false) // Ẩn preview sau khi search
    router.push(`/search?${params.toString()}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    setShowPreview(true) // Hiện preview khi người dùng nhập
  }

  const { keyword: previewKeyword, tags: previewTags } = parseSearchInput(searchInput)

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main search bar */}
        <div className="flex gap-1 justify-between">
          <div className="flex items-center flex-grow min-w-0 justify-start rounded-full border">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-full cursor-pointer"
            >
              <Filter size={18} className='ml-4 mr-0 text-gray-700 shrink-0'/>
            </button>
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="Search poems..."
              className="flex-grow min-w-0 py-2 px-2 me-2 outline-none text-15px placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="vi-button gap-1 vi-text text-white bg-gray-800 hover:bg-gray-700 px-3 shrink-0 border"
          >
            <Search size={20} />
            <span className='hidden sm:inline text-15px'>Search</span>
          </button>
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-15px font-medium text-gray-700">Advanced Filters</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  value={genreId}
                  onChange={(e) => setGenreId(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg outline-none bg-white text-15px"
                >
                  {poemGenres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setGenreId('')
                    setSearchInput('')
                  }}
                  className="px-3 py-1.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-15px cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search preview */}
        {searchInput && showPreview && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <span className="font-medium">Search Preview:</span>
              <div className="flex flex-wrap gap-4 mt-2">
                {previewKeyword && (
                  <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">
                    <strong>Keyword:</strong> &#34;{previewKeyword}&#34;
                  </span>
                )}
                {previewTags && (
                  <span className="bg-green-100 px-2 py-1 rounded text-green-700">
                    <strong>Tags:</strong> {previewTags}
                  </span>
                )}
                {genreId && (
                  <span className="bg-purple-100 px-2 py-1 rounded text-purple-700">
                    <strong>Genre:</strong> {poemGenres.find(g => g.id === genreId)?.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

const SearchForm = () => {
  return (
    <React.Suspense fallback={<div>Loading search...</div>}>
      <SearchFormContent />
    </React.Suspense>
  )
}

export default SearchForm