import React from 'react'
import Header from '@/components/layout/Header'
import SearchPoem from './SearchPoem'

const SearchPage = () => {
  return (
    <div>
      <Header 
        className="fixed top-0 left-0 min-w-[320px]"
      />
      <div className="main pt-14 w-full mx-auto max-w-[640px] pb-6">
        <div className="content">
          <div className="main-content px-2">
            <SearchPoem />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage