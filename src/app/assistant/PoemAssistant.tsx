"use client"

import React, { useState } from 'react'
import useAuth from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { aiApi } from '@/lib/services'
import { Skeleton } from '@/components/ui/skeleton'
import { Message, Chain, Step, AssistantMode } from '@/types/assistant'
import AssistantWelcome from '@/components/assistant/AssistantWelcome'
import MessagesList from '@/components/assistant/MessagesList'
import AssistantInput from '@/components/assistant/AssistantInput'

const PoemAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<AssistantMode>('write')
  const [selectedModel, setSelectedModel] = useState("")
  const [loading, setLoading] = useState(false)
  const [chain, setChain] = useState<Chain | null>(null)
  
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const hasMessages = messages.length > 0
  const lastStep = chain?.steps?.[chain.steps.length - 1]
  const isEditComplete = lastStep?.step_content?.includes("<eos>")

  const addMessage = (message: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: Date.now().toString() }])
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    if (mode === 'write') {
      await handlePoemGeneration()
    } else {
      await handlePoemEditing()
    }
  }

  const handlePoemGeneration = async () => {
    if (!selectedModel) {
      alert("Vui lòng chọn mô hình AI")
      return
    }

    const userMessage = input.trim()
    addMessage({ type: 'user', content: userMessage })
    setInput("")
    setLoading(true)

    try {
      const formData = {
        model: selectedModel,
        prompt: userMessage
      }

      const response = await aiApi.post('/generate-poem', JSON.stringify(formData), {
        headers: { 'Content-Type': 'application/json' }
      })

      addMessage({ 
        type: 'poem', 
        content: response.data,
        metadata: { model: selectedModel, prompt: userMessage }
      })
    } catch (error) {
      console.error("Lỗi khi sinh thơ:", error)
      addMessage({ 
        type: 'ai', 
        content: "Xin lỗi, có lỗi xảy ra khi sinh thơ. Vui lòng thử lại."
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePoemEditing = async () => {
    const poemText = input.trim()
    addMessage({ type: 'user', content: poemText })
    setInput("")
    setLoading(true)

    try {
      const newChain: Chain = {
        original_poem: poemText,
        steps: []
      }
      setChain(newChain)

      const response = await aiApi.post('/edit-poem/step/', newChain)
      
      addMessage({ 
        type: 'ai', 
        content: response.data.step_content 
      })

      const step: Step = {
        error_poem: response.data.error_poem,
        step_content: response.data.step_content,
        edited_poem: response.data.edited_poem,
        reasoning_score: 0,
        meaning_score: true,
        imagery_score: true,
      }

      setChain(prev => ({
        ...prev!,
        steps: [...prev!.steps, step]
      }))

      if (response.data.edited_poem) {
        addMessage({ 
          type: 'edited-poem', 
          content: response.data.edited_poem 
        })
      }
    } catch (error) {
      console.error("Lỗi khi sửa thơ:", error)
      addMessage({ 
        type: 'ai', 
        content: "Xin lỗi, có lỗi xảy ra khi phân tích thơ. Vui lòng thử lại."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContinueEditing = async () => {
    if (!chain || isEditComplete) return
    setLoading(true)

    try {
      const response = await aiApi.post(`${process.env.NEXT_PUBLIC_AI_API_BASE_URL}/edit-poem/step/`, chain)
      
      addMessage({ 
        type: 'ai', 
        content: response.data.step_content 
      })

      const step: Step = {
        error_poem: response.data.error_poem,
        step_content: response.data.step_content,
        edited_poem: response.data.edited_poem,
        reasoning_score: 0,
        meaning_score: true,
        imagery_score: true,
      }

      setChain(prev => ({
        ...prev!,
        steps: [...prev!.steps, step]
      }))

      if (response.data.edited_poem) {
        addMessage({ 
          type: 'edited-poem', 
          content: response.data.edited_poem 
        })
      }
    } catch (error) {
      console.error("Lỗi khi tiếp tục sửa thơ:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (authLoading) {
    return (
      <div className='main w-full h-screen flex items-center justify-center'>
        <Skeleton className='w-full max-w-xl m-auto h-[74px] rounded-full' />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Bạn cần đăng nhập để sử dụng trợ lý thơ</h1>
        <Button onClick={() => router.push("/sign-in")} className="mt-4">
          Đăng nhập
        </Button>
      </div>
    )
  }

  return (
    <div className={`main w-full ${hasMessages ? 'pb-32 mt-16' : 'h-screen flex items-center justify-center'}`}>
      <div className={`content ${hasMessages ? 'mx-auto w-8/12 min-w-[960px] my-4 p-4 bg-white space-y-4 rounded-lg' : 'w-full max-w-xl px-4'}`}>
        
        {/* Welcome message when no messages */}
        {!hasMessages && (
          <AssistantWelcome 
            mode={mode} 
            onModeChange={setMode} 
          />
        )}

        {/* Messages */}
        <MessagesList messages={messages} />

        {/* Loading skeleton */}
        {loading && <Skeleton className="w-2/4 h-20" />}

        {/* Continue editing button */}
        {mode === 'edit' && chain && !isEditComplete && messages.length > 0 && (
          <Button
            onClick={handleContinueEditing}
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Tiếp tục sửa"}
          </Button>
        )}

        {/* Input form */}
        <AssistantInput
          input={input}
          onInputChange={setInput}
          mode={mode}
          onModeChange={setMode}
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
          loading={loading}
          hasMessages={hasMessages}
          onSend={handleSendMessage}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}

export default PoemAssistant