"use client"

import React, { useEffect, useRef } from 'react'

type Props = {
  editedContent: string
  setEditedContent: (value: string) => void
}

const AutoResizeTextarea: React.FC<Props> = ({ editedContent, setEditedContent }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [editedContent])

  return (
    <textarea
      ref={textareaRef}
      className="text-base whitespace-pre-wrap w-full text-center resize-none overflow-hidden outline-none"
      value={editedContent}
      onChange={(e) => setEditedContent(e.target.value)}
    />
  )
}

export default AutoResizeTextarea
