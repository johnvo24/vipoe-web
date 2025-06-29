"use client"

import React, { useState, useEffect } from 'react'
import AccountInformation from '@/app/profile/info'
import useAuth from '@/lib/hooks/useAuth'
import MyPoem from './my-poem'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProfile } from '@/lib/api/auth'
import { User, BookOpen, Heart, Settings, LoaderIcon } from 'lucide-react'

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
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await getProfile(token)
          setUserData(response)
        } else {
          console.error("No token found in localStorage")
          setUserData(null)
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderIcon className="w-8 h-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Đang tải thông tin...</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
            <img
              src={userData?.avt_url || "/images/st-mtp.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userData?.full_name || "Người dùng"}</h1>
            <p className="text-blue-100">@{userData?.username || "username"}</p>
            <p className="text-blue-100 text-sm mt-1">{userData?.bio || "No bio yet"}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="account" className="w-full px-2">
        <TabsList className="w-full h-auto p-1 bg-gray-100 border-b">
          <TabsTrigger 
            value="account" 
            className="flex-1 flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
          >
            <User className="w-4 h-4" />
            <span className="inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger 
            value="poem" 
            className="flex-1 flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
          >
            <BookOpen className="w-4 h-4" />
            <span className="inline">Poem</span>
          </TabsTrigger>
          <TabsTrigger 
            value="wishlist" 
            className="flex-1 flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
          >
            <Heart className="w-4 h-4" />
            <span className="inline">Liked</span>
          </TabsTrigger>
          <TabsTrigger 
            value="account_settings" 
            className="flex-1 flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
          >
            <Settings className="w-4 h-4" />
            <span className="inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="account" className="mt-0">
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
          
          <TabsContent value="poem" className="mt-0">
            <MyPoem />
          </TabsContent>
          
          <TabsContent value="wishlist" className="mt-0">
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài thơ yêu thích</h3>
              <p className="text-gray-500">Hãy khám phá và yêu thích những bài thơ hay nhất!</p>
            </div>
          </TabsContent>
          
          <TabsContent value="account_settings" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Cài đặt tài khoản</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Đổi mật khẩu</h4>
                      <p className="text-sm text-gray-500">Cập nhật mật khẩu để bảo mật tài khoản</p>
                    </div>
                    <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      Đổi mật khẩu
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Xác thực email</h4>
                      <p className="text-sm text-gray-500">Xác nhận địa chỉ email của bạn</p>
                    </div>
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Đã xác thực
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Xóa tài khoản</h4>
                      <p className="text-sm text-gray-500">Xóa vĩnh viễn tài khoản và tất cả dữ liệu</p>
                    </div>
                    <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default TabsProfile