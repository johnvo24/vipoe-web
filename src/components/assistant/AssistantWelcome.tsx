"use client"

import { Button } from '@/components/ui/button'
import { Wand2, PenTool } from "lucide-react"
import { AssistantMode } from '@/types/assistant'

interface AssistantWelcomeProps {
  mode: AssistantMode
  onModeChange: (mode: AssistantMode) => void
}

export default function AssistantWelcome({ mode, onModeChange }: AssistantWelcomeProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        🤖 Trợ lý thơ AI
      </h1>
      <p className="text-gray-600 mb-6">
        Tôi có thể giúp bạn sáng tác thơ mới hoặc sửa chữa bài thơ hiện có
      </p>
      
      {/* Mode selection */}
      <div className="flex gap-4 justify-center mb-6">
        <Button
          variant={mode === 'write' ? 'default' : 'outline'}
          onClick={() => onModeChange('write')}
          className="flex items-center gap-2"
        >
          <Wand2 size={16} />
          Viết thơ mới
        </Button>
        <Button
          variant={mode === 'edit' ? 'default' : 'outline'}
          onClick={() => onModeChange('edit')}
          className="flex items-center gap-2"
        >
          <PenTool size={16} />
          Sửa thơ
        </Button>
      </div>
    </div>
  )
}