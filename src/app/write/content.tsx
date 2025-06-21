"use client"

import React, { useState } from 'react'
import useAuth from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown, Pencil, History } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import PostCard from '@/components/post/PostCard'
import { useRouter } from 'next/navigation'
import { aiApi, api } from '@/lib/services'
import { Skeleton } from '@/components/ui/skeleton'

const frameworks = [
  {
    model: "phobert_gpt2",
    label: "phobert_gpt2",
  },
  {
    model: "gemini-1.5-flash",
    label: "gemini-1.5-flash",
  },
  {
    model: "claude-3-5-sonnet-20241022",
    label: "claude-3-5-sonnet-20241022",
  },
]

const Content = () => {
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState("")
  const [prompt, setPrompt] = useState("")
  const [poem, setPoem] = useState("")
  const { user, loading } = useAuth()
  const router = useRouter()

  const poemData = {
    user_name: user?.username || "Anonymous",
    genre_id: 1,
    prompt: "Thơ lục bát về tình yêu",
    title: "Nhặt Tình Lục Bát",
    content: "Thương ai ngày tháng đợi chờ?\nCho ta say nhớ vần thơ nghĩa tình\nTừ ấy Lục Bát lung linh\nĐể Ta nhặt lấy cho mình chơi vơi!\nLục tình Bát nghĩa ai rơi?\nRồi gieo nhung nhớ cho đời thắm tươi\nTình yêu muôn sắc rạng ngời\nThơ tình Lục bát luôn cười đón em.\nLục bát…rơi chi… lệ mềm!\nCho mi em vướng… ái êm giọt tình\nNgày đêm nỗi nhớ riêng mình\nVần thơ Lục bát thắm in vào hồn.",
    note: "hihi",
    tags: "#lục bát #tình yêu #thơ",
    is_public: false,
    image: "https://res.cloudinary.com/dm3e2ygq9/image/upload/v1750086996/vipoe/poem_images/odm6mb2jqc45zixyvihp.jpg",
  }

  const generatePoem = async () => {
    try {
      const formData = {
        model: model,
        prompt: prompt
      };
      const response = await aiApi.post(`/generate-poem`, JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      setPoem(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return (
      <Skeleton className='w-8/12 h-96 mx-auto mt-16' />
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">You need to login to write a poem</h1>
        <Button onClick={() => router.push("/sign-in")} className="mt-4">
          Click here
        </Button>
      </div>
    )
  }

  return (
    <div className="main pt-12 w-full">
      <div className='flex justify-between w-8/12 min-w-[960px] mx-auto mt-4'>
        <div className='w-[60%] bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-2xl text-black mb-2 font-semibold'>
            <Pencil className='inline mr-2' />
            Create new poem
          </p>
          <p className='text-md text-gray-700'>Enter your prompt:</p>
          <Textarea placeholder='VD: Make a luc bat poem,...' onChange={(e) => setPrompt(e.target.value)}/>
          <p className='text-md mt-2 text-gray-700'>Model:</p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between text-gray-600"
                size="lg"
              >
                {model
                  ? frameworks.find((models) => models.model === model)?.label
                  : "Select model..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search model..." />
                <CommandList>
                  <CommandEmpty>No model found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((models) => (
                      <CommandItem
                        key={models.model}
                        value={models.model}
                        onSelect={(currentValue) => {
                          setModel(currentValue === model ? "" : currentValue)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            model === models.model ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {models.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button className='mt-4' type='button' onClick={generatePoem}>
            Generate Poem
          </Button>
        </div>
        <div className='w-[40%] bg-white p-4 rounded-lg flex justify-center items-center ms-4 shadow-sm'>
          <p>
            <History className='inline mr-2' />
            History
          </p>
        </div>
      </div>
      <div className='content bg-white mx-auto flex flex-col items-center w-8/12 min-w-[960px] my-4 py-4 rounded-lg shadow-sm'>
        <div className='w-3/4 items-center'>
          <p className='w-full text-start text-xl text-black font-semibold'>Preview:</p>
          <hr className="mt-1 mb-4 w-full border-dashed border-gray-500" />
          <div className="preview bg-gradient-to-tr from-gray-700 via-gray-400 to-gray-300 p-12">
            <PostCard className={''} poemData={poemData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content