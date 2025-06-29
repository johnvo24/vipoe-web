import React from 'react'
import Header from '@/components/layout/Header'
import SupportContent from './content'

const Support = () => {
  return (
    <div>
      <Header 
        className="fixed top-0 left-0 min-w-[320px]"
      />
      <div className="main pt-14 w-full mx-auto max-w-[640px] pb-6 h-screen">
        <SupportContent />
      </div>
    </div>
  )
}

export default Support