"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/navigation"
import { useAppSelector } from '@/lib/hooks/reduxHooks'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from "@/components/ui/button"
import * as Menubar from '@radix-ui/react-menubar'
import { SquareUser, Settings, LogOut } from 'lucide-react'
import UserAvatar from '@/components/ui/avatar'
import { selectAuthLoading, selectIsAuthenticated, selectUser } from '@/lib/store/auth/authSlice'

const UserMenu: React.FC = () => {
  const user = useAppSelector(selectUser)
  const authLoading = useAppSelector(selectAuthLoading)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsDropdownVisible(prev => !prev)

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/sign-in")
  }

  const handleClickOutSide = (event: MouseEvent) => {
    const avatarElement = document.getElementById('header-avatar')
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      && (avatarElement && !avatarElement.contains(event.target as Node))
    ) {
      setIsDropdownVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide)
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide)
    }
  }, [])

  if (authLoading) {
    return <Skeleton className="w-9 h-9 rounded-full"/>
  } 
  if (!isAuthenticated) {
    return <Button onClick={() => router.push('/sign-in')}>Login</Button>
  }

  return (
    <>
      <UserAvatar 
        id={'header-avatar'}
        className="w-9 h-9 cursor-pointer"
        src={user?.avt_url || 'https://upload.wikimedia.org/wikipedia/commons/2/21/Johnny_Depp_2020.jpg'}
        alt={"Johnny Dark"}
        fallbackText={"JD"}
        onClick={toggleDropdown}
      />
      {isDropdownVisible && (
        <Menubar.Root
          ref={dropdownRef}
          className="absolute top-[44px] border w-48 shadow-lg rounded-md p-2 bg-white"
        >
          <Menubar.Menu>
            <Menubar.Trigger 
              className="w-full inline-flex items-center text-start px-2 py-2 hover:bg-gray-200 hover:rounded-md"
              onClick={() => router.push('/profile')}
            >
              <SquareUser size={18} className="mr-4"/>
              Profile
            </Menubar.Trigger>
            <Menubar.Trigger 
              className="w-full inline-flex items-center text-start px-2 py-2 hover:bg-gray-200 hover:rounded-md"
              onClick={() => router.push('/settings')}
            >
              <Settings size={22} className="mr-3.5 -ml-0.5"/>
              Settings
            </Menubar.Trigger>
            <Menubar.Trigger 
              className="w-full inline-flex items-center text-start px-2 py-2 hover:bg-gray-200 hover:rounded-md"
              onClick={handleLogout}
            >
              <LogOut size={22} className="mr-3"/>
              Logout
            </Menubar.Trigger>
          </Menubar.Menu>
        </Menubar.Root>
      )}
    </>
  )
}

export default UserMenu