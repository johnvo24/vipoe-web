import React from 'react'
import Header from '@/components/header'

export default function Home() {
  return (
    <div className='bg-transparent'>
      <Header className="fixed top-0 left-0"/>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main content of the home page.</p>
    </div>
  )
}