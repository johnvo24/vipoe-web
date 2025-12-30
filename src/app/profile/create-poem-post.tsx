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
import { createPoem } from '@/lib/api/poem'
import { Camera } from 'lucide-react'

const CreatePoemPost = () => {
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("/images/st-mtp.jpg")
  const [data, setData] = useState({
    genre_id: 1,
    prompt: '',
    title: '',
    content: '',
    note: '',
    tags: '',
    is_public: true,
    image: null as File | null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    console.log("Submit poem data:", data)
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const formData = new FormData()
        formData.append('genre_id', data.genre_id.toString())
        formData.append('prompt', data.prompt)
        formData.append('title', data.title)
        formData.append('content', data.content)
        formData.append('note', data.note)
        formData.append('tags', data.tags)
        formData.append('is_public', data.is_public.toString())
        if (data.image) {
          formData.append('image', data.image)
        }
        await createPoem(token, formData)
        alert("Poem created successfully!")
      }
    } catch (error) {
      console.error("Failed to create poem:", error)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      setPreview(URL.createObjectURL(file))
      setData({ ...data, image: file })
    }
  }

  return (
    <div className="space-y-8">
      {/* Edit Button */}
      <div className="flex justify-center pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-white text-black border-1 hover:bg-gray-100 cursor-pointer font-semibold">
              Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle hidden></DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="genreid">Genre</Label>
                <Input
                  id="genreid"
                  name='genre_id'
                  value={data.genre_id}
                  onChange={(e) => setData({ ...data, genre_id: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Input
                  id="prompt"
                  name='prompt'
                  value={data.prompt}
                  onChange={(e) => setData({ ...data, prompt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name='title'
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Input
                  id="content"
                  name='content'
                  value={data.content}
                  onChange={(e) => setData({ ...data, content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Input
                  id="note"
                  name='note'
                  value={data.note}
                  onChange={(e) => setData({ ...data, note: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name='tags'
                  value={data.tags}
                  onChange={(e) => setData({ ...data, tags: e.target.value })}
                />
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 overflow-hidden border-4 border-gray-200 rounded-md">
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
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md"
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

                {/* {avatar && (
                  <Button
                    type='button'
                    onClick={handleAvatarUpload}
                    size={'sm'}
                    className='cursor-pointer'
                  >
                    Update Avatar
                  </Button>
                )} */}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className='py-6 w-full cursor-pointer' onClick={handleSubmit}>
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CreatePoemPost