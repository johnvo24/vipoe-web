"use client"

import { Message } from '@/types/assistant'
import MessageItem from './MessageItem'

interface ChatMessageListProps {
  messageList: Message[]
  setChatMessageList: (messageList: Message[]) => void
	endOfMessagesRef: React.RefObject<HTMLDivElement | null>
}

export default function ChatMessageList({ 
	messageList,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
  setChatMessageList,
	endOfMessagesRef,
}: ChatMessageListProps) {

	return (
		<>
			{messageList.map((messageData, id) => {
				return (<MessageItem
          key={id} 
          messageData={messageData} 
        />)
      })}
			<div ref={endOfMessagesRef} className="h-0"></div>
		</>
	)
}