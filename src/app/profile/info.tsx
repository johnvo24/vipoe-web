"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateProfile, updateAvatar } from '@/lib/api/auth'
import { Camera } from 'lucide-react'
import { AccountInformationProps } from '@/types/profile'

const AccountInformation = (props: AccountInformationProps) => {
  const [data, setData] = useState({
    full_name: props.full_name || '',
    bio: props.bio || '',
    date_of_birth: props.date_of_birth || '2023-01-01',
    phone: props.phone || '',
    location: props.location || '',
    avt_url: props.avt_url || '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(props.avt_url || "/images/st-mtp.jpg")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.avt_url) {
      setPreview(props.avt_url)
    }
  }, [props.avt_url])

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await updateProfile(token, data)
        alert("Update profile successfully!")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleAvatarUpload = async () => {
    if (avatar) {
      const formData = new FormData()
      formData.append('avatar', avatar)
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await updateAvatar(token, formData)
          if (response !== null) {
            alert("Update avatar successfully!")
            setAvatar(null)
          }
        }
      } catch (error) {
        console.error("Failed to update avatar:", error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "None"
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="space-y-8">
      {/* Edit Button */}
      <div className="flex justify-center pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="px-8 py-2 w-full bg-white font-semibold text-black border-1 hover:bg-gray-100 cursor-pointer">
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle hidden></DialogTitle>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                    <Image
                      src={preview}
                      width={128}
                      height={128}
                      alt="Avatar"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full"
                    title="Change Avatar"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                  />
                </div>

                {avatar && (
                  <Button
                    type='button'
                    onClick={handleAvatarUpload}
                    size={'sm'}
                    className='cursor-pointer'
                  >
                    Update Avatar
                  </Button>
                )}
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Fullname</Label>
                <Input
                  id="fullname"
                  value={data.full_name}
                  onChange={(e) => setData({ ...data, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Description yourself</Label>
                <Input
                  id="bio"
                  value={data.bio}
                  onChange={(e) => setData({ ...data, bio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Address</Label>
                <Input
                  id="location"
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Birth of Day</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={data.date_of_birth}
                  onChange={(e) => setData({ ...data, date_of_birth: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className='py-6 w-full cursor-pointer' onClick={handleSubmit}>
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AccountInformation