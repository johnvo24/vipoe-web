"use client"

import React from 'react'
import AccountInformation from '@/app/profile/info'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const user = {
  full_name: "John Doe",
  username: "johndoe",
  email: "johndoe@gmail.com",
  phone: "123-456-7890",
  location: "New York, USA",
  bio: "This is a sample bio.",
  date_of_birth: "1990-01-01",
}

const TabsProfile = () => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList>
        <TabsTrigger value="account">Account Information</TabsTrigger>
        <TabsTrigger value="poem">My Poem</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        <TabsTrigger value="account_settings">Account Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <AccountInformation
          full_name={user.full_name}
          username={user.username}
          email={user.email}
          phone={user.phone}
          location={user.location}
          bio={user.bio}
          date_of_birth={user.date_of_birth}
        />
      </TabsContent>
      <TabsContent value="poem">Change your password here.</TabsContent>
      <TabsContent value="wishlist"><p>Make changes to your account here.</p></TabsContent>
      <TabsContent value="account_settings">Change your password here.</TabsContent>
    </Tabs>
  )
}

export default TabsProfile