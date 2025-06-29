"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateProfile, updateAvatar } from '@/lib/api/auth'
import { Camera, Edit, MapPin, Phone, Mail, Calendar, User } from 'lucide-react'

const AccountInformation = (props: any) => {
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
      {/* Avatar Section */}
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

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">{props.full_name}</h2>
          <p className="text-gray-500">{props.bio || "No bio yet"}</p>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center p-4 border rounded-lg bg-gray-50">
            <User className="w-5 h-5 text-gray-400 mr-3" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <p className="text-gray-900">{props.full_name || "Empty"}</p>
            </div>
          </div>

          <div className="flex items-center p-4 border rounded-lg bg-gray-50">
            <Mail className="w-5 h-5 text-gray-400 mr-3" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{props.email || "Empty"}</p>
            </div>
          </div>

          <div className="flex items-center p-4 border rounded-lg bg-gray-50">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
              <p className="text-gray-900">
                {props.date_of_birth ? formatDate(props.date_of_birth) : "Empty"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-4 border rounded-lg bg-gray-50">
            <Phone className="w-5 h-5 text-gray-400 mr-3" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <p className="text-gray-900">{props.phone || "Empty"}</p>
            </div>
          </div>

          <div className="flex items-center p-4 border rounded-lg bg-gray-50">
            <MapPin className="w-5 h-5 text-gray-400 mr-3" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <p className="text-gray-900">{props.location || "Empty"}</p>
            </div>
          </div>

          <div className="flex items-center p-4 border rounded-lg bg-gray-50">
            <Edit className="w-5 h-5 text-gray-400 mr-3" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <p className="text-gray-900">{props.bio || "Empty"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="flex justify-center pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="px-8 py-2">
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa thông tin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin cá nhân của bạn. Nhấn lưu khi hoàn thành.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Họ và tên</Label>
                <Input
                  id="fullname"
                  value={data.full_name}
                  onChange={(e) => setData({ ...data, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Mô tả bản thân</Label>
                <Input
                  id="bio"
                  value={data.bio}
                  onChange={(e) => setData({ ...data, bio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Địa chỉ</Label>
                <Input
                  id="location"
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Ngày sinh</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={data.date_of_birth}
                  onChange={(e) => setData({ ...data, date_of_birth: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
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