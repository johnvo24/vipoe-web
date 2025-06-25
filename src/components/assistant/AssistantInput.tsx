"use client"

import { Button } from '@/components/ui/button'
import { AssistantMode } from '@/types/assistant'
import ModelSelector from './ModelSelector'

interface AssistantInputProps {
  input: string
  onInputChange: (value: string) => void
  mode: AssistantMode
  onModeChange: (mode: AssistantMode) => void
  selectedModel: string
  onModelSelect: (model: string) => void
  loading: boolean
  hasMessages: boolean
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export default function AssistantInput({
  input,
  onInputChange,
  mode,
  onModeChange,
  selectedModel,
  onModelSelect,
  loading,
  hasMessages,
  onSend,
  onKeyDown
}: AssistantInputProps) {
  return (
    <div className={`${hasMessages ? 'fixed bottom-0 left-0 right-0 bg-white border-t p-4' : ''}`}>
      <div className="flex items-center max-w-4xl mx-auto gap-2">
        {/* Model selection for write mode */}
        {mode === 'write' && (
          <ModelSelector
            selectedModel={selectedModel}
            onModelSelect={onModelSelect}
          />
        )}

        {/* Input textarea */}
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            mode === 'write' 
              ? "Nhập chủ đề, cảm xúc hoặc ý tưởng cho bài thơ..."
              : "Dán bài thơ cần sửa vào đây..."
          }
          rows={1}
          className="flex-grow px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
          disabled={loading}
        />

        {/* Send button */}
        <Button
          onClick={onSend}
          disabled={!input.trim() || loading || (mode === 'write' && !selectedModel)}
          className="px-6 py-3"
        >
          {loading ? "..." : mode === 'write' ? "Sinh thơ" : "Phân tích"}
        </Button>
      </div>

      {/* Mode indicator */}
      {hasMessages && (
        <div className="text-center mt-2">
          <span className="text-sm text-gray-500">
            Chế độ: {mode === 'write' ? '✍️ Viết thơ' : '🔧 Sửa thơ'} | 
            <button 
              onClick={() => onModeChange(mode === 'write' ? 'edit' : 'write')}
              className="text-blue-500 hover:underline ml-1"
            >
              Chuyển chế độ
            </button>
          </span>
        </div>
      )}
    </div>
  )
}