import { Button } from '@/components/ui/button'
import { Sparkles } from "lucide-react"
import { AssistantMode } from '@/types/assistant'

interface AssistantWelcomeProps {
  mode: AssistantMode
  onSuggestionClick?: (suggestion: string) => void
}

export default function AssistantWelcome({ mode, onSuggestionClick }: AssistantWelcomeProps) {
  const writeSuggestions = [
    "Viết một bài thơ về mùa xuân.",
    "Sáng tác một bài thơ về tình bạn.",
    "Hãy giúp tôi bắt đầu một bài thơ lãng mạn."
  ]

  const editSuggestions = [
    "Giúp tôi chỉnh sửa bài thơ này cho mượt mà hơn.",
    "Hãy làm cho bài thơ này cảm xúc hơn.",
    "Đề xuất cách cải thiện nhịp điệu cho bài thơ."
  ]

  const suggestions = mode === 'chat' ? writeSuggestions : editSuggestions

  return (
    <div className="text-center w-full h-full flex items-center justify-center">
      <div className="px-2 w-full">
        <h1 className="text-3xl mb-2">
          🤖
        </h1>
        <h1 className="vi-text-primary text-3xl font-bold mb-2">
          AI Assistant
        </h1>
        <p className="vi-text-second mb-6">
          I&#39;ll help you write or edit your poem!
        </p>
        <div className="mb-4">
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex w-full text-left justify-start h-auto p-3 text-15px vi-text-second hover:bg-gray-50"
                onClick={() => onSuggestionClick?.(suggestion)}
              >
                <Sparkles className="flex-shrink-0 mr-2" />
                <span className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                  {suggestion}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}