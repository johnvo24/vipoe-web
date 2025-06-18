"use client"

import React, { useState, useEffect } from 'react'
import AccountInformation from '@/app/profile/info'
import useAuth from '@/lib/hooks/useAuth'
import MyPoem from './my-poem'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from '@/lib/services'

interface User {
  full_name: string
  username: string
  email: string
  avt_url: string
  bio: string
  phone: string
  location: string
  date_of_birth: string
}

const TabsProfile = () => {
  const { user, loading } = useAuth()
  const [userData, setUserData] = useState<User|null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await api.get("/v1/user/profile", {
          headers: { Authorization: `Bearer ${token}`},
        })
        setUserData(response.data)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }
  
    if (user) {
      fetchProfile()
    }
  }, [user])

  if (loading) {
    return <div>Chờ xíu...</div>
  }

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
          full_name={userData?.full_name}
          username={userData?.username}
          email={userData?.email}
          avt_url={userData?.avt_url}
          bio={userData?.bio}
          phone={userData?.phone}
          location={userData?.location}
          date_of_birth={userData?.date_of_birth}
        />
      </TabsContent>
      <TabsContent value="poem"><MyPoem /></TabsContent>
      <TabsContent value="wishlist"><p>Make changes to your account here.</p></TabsContent>
      <TabsContent value="account_settings">Change your password here.</TabsContent>
    </Tabs>
  )
}

export default TabsProfile