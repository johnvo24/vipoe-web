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
    prompt: prompt || "Thơ lục bát về tình yêu",
    title: "Nhặt Tình Lục Bát",
    content: poem || "Thương ai ngày tháng đợi chờ?\nCho ta say nhớ vần thơ nghĩa tình\nTừ ấy Lục Bát lung linh\nĐể Ta nhặt lấy cho mình chơi vơi!\nLục tình Bát nghĩa ai rơi?\nRồi gieo nhung nhớ cho đời thắm tươi\nTình yêu muôn sắc rạng ngời\nThơ tình Lục bát luôn cười đón em.\nLục bát…rơi chi… lệ mềm!\nCho mi em vướng… ái êm giọt tình\nNgày đêm nỗi nhớ riêng mình\nVần thơ Lục bát thắm in vào hồn.",
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
    <div className="flex flex-col items-center min-h-screen bg-[#f7f7f7] pt-16">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Pencil className="inline mr-2" /> Viết thơ mới
        </h1>
        <p className="text-gray-600 mb-4">Thả cảm xúc, chọn mô hình AI và sáng tác thơ!</p>
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Nhập chủ đề, cảm xúc hoặc ý tưởng cho bài thơ..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="resize-none min-h-[80px]"
          />
          <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between text-gray-600 min-w-[180px]"
                  size="lg"
                >
                  {model
                    ? frameworks.find((m) => m.model === model)?.label
                    : "Chọn mô hình AI"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Tìm mô hình..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((m) => (
                        <CommandItem
                          key={m.model}
                          value={m.model}
                          onSelect={(currentValue) => {
                            setModel(currentValue === model ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              model === m.model ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {m.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              className="ml-auto"
              type="button"
              onClick={generatePoem}
              disabled={!prompt || !model}
            >
              Sinh thơ
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl mt-8">
        <p className="text-xl font-semibold text-gray-800 mb-2">Xem trước bài thơ</p>
        <div className="bg-gradient-to-tr from-gray-700 via-gray-400 to-gray-300 rounded-xl p-6 shadow">
          <PostCard className="" poemData={poemData} />
        </div>
      </div>
    </div>
  )
}

export default Content