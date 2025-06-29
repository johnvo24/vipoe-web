"use client"

import { Button } from '@/components/ui/button'
import { AssistantMode } from '@/types/assistant'
import { BrushCleaning, Globe, PenTool, SendHorizontal } from 'lucide-react'
import { useEffect } from 'react'

interface AssistantInputProps {
  input: string
  setInput: (value: string) => void
  mode: AssistantMode
  setMode: (mode: AssistantMode) => void
  isSearchMode: boolean
  setIsSearchMode: (isSearchMode: boolean) => void
  loading: boolean
  hasMessages: boolean
  onSend: () => void
}

export default function AssistantInput({
  input,
  setInput,
  mode,
  setMode,
  isSearchMode,
  setIsSearchMode,
  loading,
  hasMessages,
  onSend,
}: AssistantInputProps) {

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleClickEditMode = () => {
    setMode(mode === 'chat' ? 'edit' : 'chat')
  }

  useEffect(() => {
    if (mode === 'edit') {
      setIsSearchMode(false)
    }
  }, [mode, setIsSearchMode])

  return (
    <div className={"fixed bottom-0 left-0 right-0 max-w-[640px] mx-auto px-2 pb-4 sm:pb-8 z-10"}>
      <div className="vi-shadow flex flex-col bg-gray-100 p-2 gap-1 rounded-3xl">

        <textarea
          value={input}
          disabled={loading}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'chat' ? "Ask anything here..." : "Paste your poem here to edit..."}
          rows={1}
          maxLength={2000}
          spellCheck={false}
          ref={(el) => {
            if (!el) return
            const max_rows = 10
            el.style.height = 'auto'
            el.style.height = Math.min(el.scrollHeight, parseInt(getComputedStyle(el).lineHeight) * max_rows) + 'px'
          }}
          style={{ overflow: 'auto' }}
          className="flex-grow pt-2 px-2 text-15px focus:outline-none resize-none"
        />

        <div className="btn_box flex justify-between mt-2">
          {/* <ModelSelector
            selectedModel={selectedModel}
            onModelSelect={onModelSelect}
          /> */}
          <div className="text-center flex gap-1">
            <button 
              onClick={() => setIsSearchMode(!isSearchMode)}
              disabled={mode === "edit"}
              className={`vi-button ${isSearchMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-200"} select-none`}
            >
              <Globe size={20} className='mr-1'/>
              <span className='text-15px'>Search</span>
            </button>
            <button 
              onClick={() => handleClickEditMode()}
              className={`vi-button ${mode === "edit" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-200"} select-none`}
            >
              <PenTool size={20} className='mr-1'/>
              <span className='text-15px'>Edit Mode</span>
            </button>
            <button 
              onClick={() => input.length != 0 && setInput("")}
              className="vi-button bg-gray-200"
            >
              <BrushCleaning size={20} className='mx-0.5'/>
            </button>
          </div>
          <Button
            onClick={onSend}
            disabled={loading || !input.trim()}
            className="h-10 w-10 rounded-full cursor-pointer"
          >
            <SendHorizontal size={20}/>
          </Button>
        </div>
      </div>
    </div>
  )
}