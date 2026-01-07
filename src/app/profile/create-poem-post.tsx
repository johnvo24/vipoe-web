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
import { createPoem, getAllGenres } from '@/lib/api/poem'
import { Camera } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { toast, Toaster } from 'sonner'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CreatePoemPost = () => {
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("/images/icon_camera.jpg")
  const [genres, setGenres] = useState<object[]>([])
  const [open, setOpen] = useState(false)
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

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await getAllGenres()
        if (genres.length > 0) {
          setGenres(genres)
        }
      } catch (error) {
        console.error("Failed to fetch genres:", error)
      }
    }
    fetchGenres()
  }, [])

  const handleSubmit = async () => {
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
        toast.success("Poem created successfully!")
        setOpen(false)
        // Reset form
        setData({
          genre_id: 1,
          prompt: '',
          title: '',
          content: '',
          note: '',
          tags: '',
          is_public: true,
          image: null,
        })
        setPreview("/images/icon_camera.jpg")
      }
    } catch (error) {
      toast.error("Failed to create poem.")
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black border-1 hover:bg-gray-100 cursor-pointer">
              Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle hidden></DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className='flex justify-between items-center space-x-2'>
                <div className="space-y-2 w-full">
                  <Label htmlFor="genreid">Genre</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Genres</SelectLabel>
                        {genres.map((genre: any) => (
                          <SelectItem
                            key={genre.id}
                            value={genre.id.toString()}
                            onClick={() => setData({ ...data, genre_id: genre.id })}
                          >{genre.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Input
                    id="prompt"
                    name='prompt'
                    value={data.prompt}
                    onChange={(e) => setData({ ...data, prompt: e.target.value })}
                    placeholder='Type prompt'
                  />
                </div>
              </div>
              <div className='flex justify-between items-center space-x-2'>
                <div className="space-y-2 w-full">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name='title'
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    placeholder='Type title'
                  />
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="note">Note</Label>
                  <Input
                    id="note"
                    name='note'
                    value={data.note}
                    onChange={(e) => setData({ ...data, note: e.target.value })}
                    placeholder='Type note (optional)'
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name='content'
                  value={data.content}
                  onChange={(e) => setData({ ...data, content: e.target.value })}
                  placeholder='Type content'
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name='tags'
                  value={data.tags}
                  onChange={(e) => setData({ ...data, tags: e.target.value })}
                  placeholder='Type tags (optional)'
                />
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 overflow-hidden border-2 border-dashed border-gray-200 rounded-md">
                    <Image
                      src={preview}
                      width={128}
                      height={128}
                      alt="Avatar"
                      className="object-cover w-full h-full opacity-70"
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
        <Toaster position="bottom-center" richColors />
      </div>
    </div>
  )
}

export default CreatePoemPost