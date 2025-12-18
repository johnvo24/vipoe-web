import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: 'now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
})

export const timeAgo = (isoTime: string): string => {
  return dayjs(isoTime).fromNow()
}

export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  } else if (num < 1000000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  } else {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
  }
}

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function splitPoemAndCalcSlides(poemContent: string): {
  slides: number[]
  result: string[][]
} {
  // 1. Tách dòng theo ký tự \n
  const lines: string[] = poemContent
    .split(/\r?\\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
 
  // 2. Mỗi slide chứa 4 dòng
  const SLIDE_SIZE = 4
  const slidesLength: number = Math.ceil(lines.length / SLIDE_SIZE)
  const slides: number[] = Array.from({ length: slidesLength }, (_, i) => i)

  // 3. Gom 4 dòng thành 1 slide
  const result: string[][] = []
  for (let i = 0; i < lines.length; i += SLIDE_SIZE) {
    result.push(lines.slice(i, i + SLIDE_SIZE))
  }

  return {
    slides,
    result
  }
}
