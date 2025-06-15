import React from 'react'
import Header from '@/components/header'
import TabsProfile from '@/app/profile/tabs'

const Profile = () => {
  return (
    <div className="bg-transparent">
      <Header 
        className="fixed top-0 left-0"
      />
      <div className='w-3/5 mt-16 mb-4 h-auto mx-auto p-2 bg-white rounded-md drop-shadow-md overflow-hidden'>
        <TabsProfile />
      </div>
    </div>
  )
}

export default Profile