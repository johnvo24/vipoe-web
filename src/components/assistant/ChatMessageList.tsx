"use client"

import { Message } from '@/types/assistant'
import { useEffect } from 'react'
import MessageItem from './MessageItem'

// const sampleMessages: Message[] = [
// 	{
// 		id: '1',
// 		type: 'user',
// 		content: 'Xin chào! Bạn có thể giúp tôi viết một bài thơ về mùa thu không?',
// 	},
// 	{
// 		id: '2',
// 		type: 'ai',
// 		content:
// 			'Chào bạn! Tôi rất vui được giúp bạn viết thơ về mùa thu. Bạn có muốn thơ theo phong cách nào đặc biệt không? Ví dụ như thơ lục bát, thơ tự do, hay thơ ngũ ngôn?',
// 	},
// 	{
// 		id: '3',
// 		type: 'user',
// 		content: 'Tôi muốn một bài thơ lục bát về lá vàng rơi và nỗi nhớ.',
// 	},
// 	{
// 		id: '7',
// 		type: 'ai',
// 		content:
// 			'Tôi đã chỉnh sửa bài thơ để thêm hình ảnh đàn chim di cư. Bạn có hài lòng với phiên bản mới không? Tôi có thể tiếp tục điều chỉnh nếu bạn muốn.',
// 	},
// ]

interface ChatMessageListProps {
  messageList: Message[]
  setChatMessageList: (messageList: Message[]) => void
	endOfMessagesRef: React.RefObject<HTMLDivElement | null>
}

export default function ChatMessageList({ 
  messageList,
  setChatMessageList,
	endOfMessagesRef,
}: ChatMessageListProps) {
  // useEffect(() => {
  //   setChatMessageList([...sampleMessages, ...messageList, ...sampleMessages, ...sampleMessages, ...sampleMessages, ...sampleMessages, ...sampleMessages, ...sampleMessages, ...sampleMessages, ...sampleMessages])
  // }, [setChatMessageList])

	return (
		<>
			{messageList.map((messageData, id) => {
				return (<MessageItem
          key={id} 
          messageData={messageData} 
        />)
					// case 'poem':
					//   return (
					//     <div key={message.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border">
					//       <h3 className="font-semibold text-gray-800 mb-2">✨ Bài thơ được tạo:</h3>
					//       <div className="whitespace-pre-line text-gray-700 italic">
					//         {message.content}
					//       </div>
					//       {message.metadata && (
					//         <div className="mt-2 text-xs text-gray-500">
					//           Mô hình: {message.metadata.model}
					//         </div>
					//       )}
					//     </div>
					//   )
					// case 'edited-poem':
					//   return <EditedPoemMessage key={message.id} content={message.content} />
					// default:
					// 	return null
          // }
      })}
			<div ref={endOfMessagesRef} className="h-0"></div>
		</>
	)
}