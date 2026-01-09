'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import { PostShareCard } from './PostShareCard'
import { useShareAsImage } from '@/lib/hooks/useShareAsImage'
import { v4 as uuid } from 'uuid'
import { EmojiItem } from '@/types/poem'

const EMOJIS = ['😀', '😂', '😍', '🔥', '❤️', '😎']

export function ShareAsImageModal({
  open,
  onClose,
  poemData,
}: {
  open: boolean
  onClose: () => void
  poemData: any
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [theme, setTheme] = useState<'light' | 'dark' | 'pink' | 'purple' | 'blue' | 'red'>('light')
  const containerRef = useRef<HTMLDivElement>(null)
  const captureRef = useRef<HTMLDivElement>(null)
  const [emojis, setEmojis] = useState<EmojiItem[]>([])
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const { copyImage, downloadImage, loading } =
    useShareAsImage(ref)

  const addEmoji = (symbol: string) => {
    setEmojis(prev => [
      ...prev,
      { id: uuid(), symbol, x: 150, y: 100 },
    ])
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    setEmojis(prev =>
      prev.map(emoji =>
        emoji.id === draggingId
          ? {
            ...emoji,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          }
          : emoji
      )
    )
  }

  const stopDragging = () => setDraggingId(null)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="sr-only">
        Profile preview
      </DialogTitle>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 bg-[#f5f5f5] [&>button.absolute]:hidden">
        {/* Preview */}
        <div className="flex-1 overflow-y-auto scale-[0.9] mt-6 origin-top">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            className="relative"
          >
            <div ref={ref}>
              <PostShareCard
                poem={poemData}
                theme={theme}
                emojis={emojis}
                onEmojiMouseDown={setDraggingId}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-white rounded-bl-lg rounded-br-lg">
          {/* Theme switch */}
          <div className="flex-col items-start space-y-1">
            <div className='flex gap-2'>
              <button
                onClick={() => setTheme('light')}
                className={`h-6 w-6 rounded-full border ${theme === 'light' && 'ring-2 ring-gray-500'
                  } bg-white`}
              />
              <button
                onClick={() => setTheme('dark')}
                className={`h-6 w-6 rounded-full ${theme === 'dark' && 'ring-2 ring-gray-500'
                  } bg-black`}
              />
              <button
                onClick={() => setTheme('pink')}
                className={`h-6 w-6 rounded-full ${theme === 'pink' && 'ring-2 ring-gray-500'
                  } bg-pink-500`}
              />
              <button
                onClick={() => setTheme('purple')}
                className={`h-6 w-6 rounded-full ${theme === 'purple' && 'ring-2 ring-gray-600'
                  } bg-purple-500`}
              />
              <button
                onClick={() => setTheme('blue')}
                className={`h-6 w-6 rounded-full ${theme === 'blue' && 'ring-2 ring-gray-500'
                  } bg-blue-500`}
              />
              <button
                onClick={() => setTheme('red')}
                className={`h-6 w-6 rounded-full ${theme === 'red' && 'ring-2 ring-gray-500'
                  } bg-red-500`}
              />
            </div>
            <div className="flex gap-2">
              <div>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => addEmoji(e)} className="text-2xl">
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadImage} className='cursor-pointer'>
              <Download />
            </Button>
            <Button onClick={copyImage} disabled={loading} className='cursor-pointer'>
              {loading ? 'Đang sao chép...' : 'Sao chép'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
