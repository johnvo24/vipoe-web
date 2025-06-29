"use client"

import { Message } from "@/types/assistant"

const MessageItem = ({messageData}: {messageData: Message}) => {
  return messageData.type == 'user' ? (
    <div className='flex flex-col items-end w-full p-2'>
      <div className="vi-text bg-gray-100 max-w-4/5 py-2 px-4 rounded-3xl">
        <p className="whitespace-pre-line">
          { messageData.content }
        </p>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-start w-full p-2 sm:px-0'>
      <div className="vi-text w-full p-2">
        <p className="whitespace-pre-line">
          { messageData.content }
        </p>
      </div>
    </div>
  )
}

export default MessageItem