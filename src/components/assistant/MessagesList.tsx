"use client"

import { Message } from '@/types/assistant'
import UserMessage from '@/components/user-message'
import AIMessage from '@/components/ai-message'
import EditedPoemMessage from '@/components/edited-poem'

interface MessagesListProps {
  messages: Message[]
}

export default function MessagesList({ messages }: MessagesListProps) {
  return (
    <>
      {messages.map((message) => {
        switch (message.type) {
          case 'user':
            return <UserMessage key={message.id} content={message.content} />
          case 'ai':
            return <AIMessage key={message.id} content={message.content} />
          case 'poem':
            return (
              <div key={message.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-800 mb-2">✨ Bài thơ được tạo:</h3>
                <div className="whitespace-pre-line text-gray-700 italic">
                  {message.content}
                </div>
                {message.metadata && (
                  <div className="mt-2 text-xs text-gray-500">
                    Mô hình: {message.metadata.model}
                  </div>
                )}
              </div>
            )
          case 'edited-poem':
            return <EditedPoemMessage key={message.id} content={message.content} />
          default:
            return null
        }
      })}
    </>
  )
}