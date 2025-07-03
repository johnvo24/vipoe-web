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

function groupIntoPairs(lines: string[]): string[][] {
  const result: string[][] = []
  for (let i = 0; i < lines.length; i += 2) {
    const pair = [lines[i]]
    if (i + 1 < lines.length) {
      pair.push(lines[i + 1])
    }
    result.push(pair)
  }
  return result
}

export function insertNewlineAfterWordIndex(text: string, wordIndex: number): string {
  const words = text.split(/\s+/)

  if (words.length <= wordIndex) return text

  const before = words.slice(0, wordIndex).join(' ')
  const after = words.slice(wordIndex).join(' ')

  return `${before}\n${after}`
}

export function splitPoemAndCalcSlides(poemContent: string): {
  lines: string[]
  slidesLength: number
  slides: number[]
  result: string[][]
} {
  const rawLines: string[] = poemContent.match(/[^.?!]+[.?!]/g)?.map(line => line.trim()) || []
  const lines: string[] = []
  for (let i = 0; i < rawLines.length; i++) {
    const pair = insertNewlineAfterWordIndex(rawLines[i], 6)
    lines.push(pair.trim())
  }

  const slidesLength: number = Math.ceil(lines.length / 2)
  const slides: number[] = Array.from({ length: slidesLength }, (_, index) => index)
  const result = groupIntoPairs(lines)

  return {
    lines,
    slidesLength,
    slides,
    result
  }
}
