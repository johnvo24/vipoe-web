"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { aiApi } from '@/lib/services'
import { Skeleton } from '@/components/ui/skeleton'
import { Message, Chain, Step, AssistantMode } from '@/types/assistant'
import AssistantWelcome from '@/components/assistant/AssistantWelcome'
import AssistantInput from '@/components/assistant/AssistantInput'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks'
import { selectAuthLoading, selectIsAuthenticated, selectToken, selectUser } from '@/lib/store/auth/authSlice'
import ChatMessageList from '@/components/assistant/ChatMessageList'
import { sendChatMessage } from '@/lib/api/assistant'
import { logout } from '@/lib/store/auth/authThunks'

const chatModel = 'auto'

const PoemAssistant = () => {
  const [messageList, setMessageList] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<AssistantMode>('chat')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [chain, setChain] = useState<Chain | null>(null)
  
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useAppSelector(selectUser)
  const token = useAppSelector(selectToken)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const authLoading = useAppSelector(selectAuthLoading)
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  const hasMessages = messageList.length > 0
  const lastStep = chain?.steps?.[chain.steps.length - 1]
  const isEditComplete = lastStep?.step_content?.includes("<eos>")

  const addMessage = (message: Omit<Message, 'id'>) => {
    setMessageList(prev => [...prev, { ...message, id: Date.now().toString() }])
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    if (mode === 'chat') {
      await handleChatModeSend()
    } else {
      await handleEditModeSend()
    }
  }

  const handleChatModeSend = async () => {
    const userMessage = input.trim()
    addMessage({ type: 'user', content: userMessage })
    setInput("")
    setLoading(true)

    try {
      if (!token) {
        dispatch(logout())
        router.push('/sign-in')
        return
      }

      console.log(isSearchMode);
      

      const payload = {
        model: chatModel,
        search_mode: isSearchMode,
        prompt: userMessage
      }
      const resData = await sendChatMessage(token, payload);

      addMessage({ 
        type: 'ai', 
        content: resData.answer,
        metadata: { model: chatModel, prompt: userMessage }
      })
    } catch (error) {
      console.error("Chat Message Send Error:", error)
      addMessage({ 
        type: 'ai', 
        content: "Oops! Something went wrong while processing your message. Please try again later."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditModeSend = async () => {
    const userMessage = input.trim()
    addMessage({ type: 'user', content: userMessage })
    setInput("")
    setLoading(true)

    addMessage({
      type: 'ai',
      content: "The poem editing feature is currently under development. Please check back soon for updates."
    })
    
    setLoading(false)
    // try {
    //   // Start a new chain for editing
    //   const newChain: Chain = {
    //     original_poem: userMessage,
    //     steps: []
    //   }
    //   setChain(newChain)

    //   // Request AI to edit the poem (first step)
    //   const response = await aiApi.post('/edit-poem/step/', newChain)
      
    //   // Add AI step message
    //   addMessage({ 
    //     type: 'ai', 
    //     content: response.data.step_content 
    //   })

    //   // Add step to chain
    //   const step: Step = {
    //     error_poem: response.data.error_poem,
    //     step_content: response.data.step_content,
    //     edited_poem: response.data.edited_poem,
    //     reasoning_score: 0,
    //     meaning_score: true,
    //     imagery_score: true,
    //   }

    //   setChain(prev => ({
    //     ...prev!,
    //     steps: [...prev!.steps, step]
    //   }))

    //   // If edited poem is available, add as a separate message
    //   if (response.data.edited_poem) {
    //     addMessage({ 
    //       type: 'ai', 
    //       content: response.data.edited_poem 
    //     })
    //   }
    // } catch (error) {
    //   console.error("Lỗi khi sửa thơ:", error)
    //   addMessage({ 
    //     type: 'ai', 
    //     content: "Oops! Something went wrong while editing your poem. Please try again later."
    //   })
    // } finally {
    //   setLoading(false)
    // }
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
          type: 'ai', 
          content: response.data.edited_poem 
        })
      }
    } catch (error) {
      console.error("Lỗi khi tiếp tục sửa thơ:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/sign-in')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  if (authLoading) {
    return (
      <div className='main w-full h-screen flex items-center justify-center'>
        <Skeleton className='w-full max-w-xl m-auto h-[74px] rounded-full' />
      </div>
    )
  }

  return (
    <div className={"poem-assistant-box h-full"}>
      {!hasMessages ? (
        <AssistantWelcome 
          mode={mode} 
          onSuggestionClick={(suggestion) => {
            setInput(suggestion)
          }}
        />
      ) : (
        <div className="chat-content pb-[200px]">
          <ChatMessageList 
            messageList={messageList} 
            setChatMessageList={setMessageList}
            endOfMessagesRef={endOfMessagesRef}
          />
        </div>
      )}
      {/* {loading && <Skeleton className="w-2/4 h-20" />} */}
      {/* {mode === 'edit' && chain && !isEditComplete && messages.length > 0 && (
        <Button
          onClick={handleContinueEditing}
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Tiếp tục sửa"}
        </Button>
      )} */}

      <div className="fixed left-0 right-0 bottom-0 max-w-[640px] mx-auto h-[90px] sm:h-[106px] bg-white"></div>
      <AssistantInput
        input={input}
        setInput={setInput}
        mode={mode}
        setMode={setMode}
        isSearchMode={isSearchMode}
        setIsSearchMode={setIsSearchMode}
        loading={loading}
        hasMessages={hasMessages}
        onSend={handleSendMessage}
      />
    </div>
  )
}

export default PoemAssistant