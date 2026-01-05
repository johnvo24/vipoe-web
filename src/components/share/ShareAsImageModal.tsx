'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import { PostShareCard } from './PostShareCard'
import { useShareAsImage } from '@/lib/hooks/useShareAsImage'

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const { copyImage, downloadImage, loading } =
    useShareAsImage(ref)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="sr-only">
        Profile preview
      </DialogTitle>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 bg-[#f5f5f5] [&>button.absolute]:hidden">
        {/* Preview */}
        <div className="flex-1 overflow-y-auto">
          <div ref={ref} className='scale-[0.9] mt-6 origin-top pointer-events-none select-none'>
            <PostShareCard poem={poemData} theme={theme} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-white rounded-bl-lg rounded-br-lg">
          {/* Theme switch */}
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`h-6 w-6 rounded-full border ${theme === 'light' && 'ring-2 ring-blue-500'
                } bg-white`}
            />
            <button
              onClick={() => setTheme('dark')}
              className={`h-6 w-6 rounded-full ${theme === 'dark' && 'ring-2 ring-blue-500'
                } bg-black`}
            />
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
