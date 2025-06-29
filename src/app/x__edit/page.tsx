import React from 'react'
import Header from '@/components/layout/Header'
import Content from './content'

const Edit = () => {
  return (
    <div className="bg-transparent">
      <Header
        className="fixed top-0 left-0"
      />
      <Content />
    </div>
  )
}

export default Edit