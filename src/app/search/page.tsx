import React, { Suspense } from 'react'
import SearchPoem from './SearchPoem'
import Header from '@/components/layout/Header'

function SearchContent() {
  return <SearchPoem />
}

export default function Page() {
  return (
    <div>
      <Header 
        className="fixed top-0 left-0 min-w-[320px]"
      />
      <div className="main pt-14 w-full mx-auto max-w-[640px] pb-6">
        <div className="content">
          <div className="main-content px-2">
            <Suspense fallback={
              <div className="flex justify-center p-4">
                <span>Loading search...</span>
              </div>
            }>
              <SearchContent />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}