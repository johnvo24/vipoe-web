import React from 'react'
import Header from '@/components/layout/Header'
import Content from './content'

const Write = () => {
  return (
    <div>
      <Header 
        className="fixed top-0 left-0 min-w-[320px]"
      />
      <div className="main pt-14 w-full mx-auto max-w-[640px] pb-6">
        <div className="content">
          <div className="main-content px-2 border">
            <Content />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Write