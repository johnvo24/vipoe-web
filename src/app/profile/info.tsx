"use client"

import React, { useState, useRef } from 'react'
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
import { api } from '@/lib/services'
import { API_ROUTES } from '@/lib/routes'

const AccountInformation = (props: any) => {
  const [data, setData] = useState({
    full_name: props.full_name || '',
    bio: props.bio || '',
    dob: props.date_of_birth || '',
    phone: props.phone || '',
    location: props.location || '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(props.avt_url || "/images/st-mtp.jpg")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const response = api.put(API_ROUTES.UPDATE_PROFILE, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        alert("Edited Successful")
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
          const response = await api.put("/v1/profile/avatar", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.status === 200) {
            alert("Avatar updated successfully")
            setPreview(URL.createObjectURL(avatar))
          } else {
            alert("Failed to update avatar")
          }
        }
      } catch (error) {
        console.error("Error uploading avatar:", error)
      }
    } else {
      console.log("No avatar selected")
    }
  }

  return (
    <div className="flex flex-col items-center bg-white rounded-md overflow-hidden">
      <div className="w-full h-36 bg-cover" style={{ backgroundImage: "url('/images/bg-stmpt.jpg')" }}></div>
      <div className="-mt-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden relative group">
        <Image 
          src={preview}
          width={150}
          height={150}
          alt="Avatar"
          className="object-cover w-full h-full"
        />
        <button
          type="button"
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
          title="Change Avatar"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-white font-semibold">Upload Avatar</span>
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
        <Button type='submit' onClick={handleAvatarUpload} size={'sm'} className='cursor-pointer mt-2'>Update Avatar</Button>
      )}

      <div className="mt-2 text-center">
        <h1 className="text-xl font-bold">{props.full_name}</h1>
        <p className="text-gray-500">{ props.bio == null ? "None" : props.bio }</p>
      </div>
      <hr className="my-8 w-3/4 border-dashed border-gray-300" />

      <div className="w-3/4 space-y-4 mb-6">
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Fullname:</label>
          <input
            type="text"
            value={ props.full_name == null ? "None" : props.full_name }
            readOnly
            className="flex-1 bg-gray-100 p-2 rounded-md border border-gray-300 pointer-events-none select-none text-muted-foreground"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Email:</label>
          <input
            type="email"
            value={ props.email == null ? "None" : props.email }
            readOnly
            className="flex-1 bg-gray-100 p-2 rounded-md border border-gray-300 pointer-events-none select-none text-muted-foreground"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Date of birth:</label>
          <input
            type="date"
            value={ props.date_of_birth == null ? "dd/mm/yyyy" : props.date_of_birth }
            readOnly
            className="flex-1 bg-gray-100 p-2 rounded-md border border-gray-300 pointer-events-none select-none text-muted-foreground"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Bio:</label>
          <input
            type="text"
            value={ props.bio == null ? "None" : props.bio }
            readOnly
            className="flex-1 bg-gray-100 p-2 rounded-md border border-gray-300 pointer-events-none select-none text-muted-foreground"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Phone:</label>
          <input
            type="text"
            value={ props.phone == null ? "None" : props.phone }
            readOnly
            className="flex-1 bg-gray-100 p-2 rounded-md border border-gray-300 pointer-events-none select-none text-muted-foreground"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Location:</label>
          <input
            type="text"
            value={ props.location == null ? "None" : props.location }
            readOnly
            className="flex-1 bg-gray-100 p-2 rounded-md border border-gray-300 pointer-events-none select-none text-muted-foreground"
          />
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex w-5/6 items-center">
              <Label htmlFor="fullname" className="w-1/3">
                Fullname
              </Label>
              <Input 
                id="full_name" 
                name="full_name" 
                value={data.full_name} 
                type="text"
                className="flex-1"
                onChange={(e) => setData({ ...data, full_name: e.target.value })}
              />
            </div>
            <div className="flex w-5/6 items-center">
              <Label htmlFor="fullname" className="w-1/3">
                Dob
              </Label>
              <Input 
                id="dob" 
                name="dob" 
                value={data.dob} 
                type="date" 
                className="flex-1"
                onChange={(e) => setData({ ...data, dob: e.target.value })}
              />
            </div>
            <div className="flex w-5/6 items-center">
              <Label htmlFor="fullname" className="w-1/3">
                Bio
              </Label>
              <Input 
                id="bio" 
                name="bio" 
                value={data.bio} 
                type="text" 
                className="flex-1"
                onChange={(e) => setData({ ...data, bio: e.target.value })}
              />
            </div>
            <div className="flex w-5/6 items-center">
              <Label htmlFor="fullname" className="w-1/3">
                Phone
              </Label>
              <Input 
                id="phone" 
                name="phone" 
                value={data.phone} 
                type="text" 
                className="flex-1"
                onChange={(e) => setData({ ...data, phone: e.target.value })}
              />
            </div>
            <div className="flex w-5/6 items-center">
              <Label htmlFor="fullname" className="w-1/3">
                Location
              </Label>
              <Input 
                id="location" 
                name="location" 
                value={data.location} 
                type="text" 
                className="flex-1"
                onChange={(e) => setData({ ...data, location: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className='cursor-pointer' onClick={handleSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AccountInformation