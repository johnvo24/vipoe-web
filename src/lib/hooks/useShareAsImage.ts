import { RefObject, useState } from 'react'
import { toPng } from 'html-to-image'

export function useShareAsImage<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options?: {
    fileName?: string
    pixelRatio?: number
  }
) {
  const [loading, setLoading] = useState(false)

  const generateImage = async () => {
    if (!ref.current) return null

    return await toPng(ref.current, {
      cacheBust: true,
      pixelRatio: options?.pixelRatio ?? 2,
    })
  }

  const copyImage = async () => {
    if (!ref.current) return
    setLoading(true)

    try {
      const dataUrl = await generateImage()
      if (!dataUrl) return

      const blob = await (await fetch(dataUrl)).blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = async () => {
    const dataUrl = await generateImage()
    if (!dataUrl) return

    const a = document.createElement('a')
    a.href = dataUrl
    a.download = options?.fileName ?? 'vipoe-post.png'
    a.click()
  }

  return {
    loading,
    copyImage,
    downloadImage,
  }
}
