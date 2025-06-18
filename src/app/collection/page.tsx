import React from 'react'
import Header from '@/components/layout/Header'
import Content from './content'

const Collection = () => {
  return (
    <div className="bg-transparent">
      <Header 
        className="fixed top-0 left-0"
      />
      <div className='main pt-12 w-full'>
        <Content />
      </div>
    </div>
  )
}

export default Collection