import React from 'react'
import Header from '@/components/layout/Header'
import TabsProfile from '@/app/profile/tabs'

const Profile = () => {
  return (
    <div>
      <Header 
        className="fixed top-0 left-0 min-w-[320px]"
      />
      <div className="main pt-12 w-full mx-auto max-w-[640px] pb-6 h-screen">
        <h1 className='text-center p-4'>Profile</h1>
        <TabsProfile />
      </div>
    </div>
  )
}

export default Profile