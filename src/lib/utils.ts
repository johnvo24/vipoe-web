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

function hasPunctuation(poemData: string): boolean {
  const punctuationRegex = /[.,!?;:]/
  return punctuationRegex.test(poemData)
}

function splitPoemWithoutPunctuation(poem: string): string[] {
  const words = poem.trim().split(/\s+/)
  const result: string[] = []

  for (let i = 0; i < words.length; i += 14) {
    const chunk = words.slice(i, i + 14).join(' ')
    result.push(chunk)
  }

  return result
}

function insertNewlineAfterWordIndex(text: string, wordIndex: number): string {
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
  let lines: string[] = []
  if (hasPunctuation(poemContent)) {
    lines = poemContent.match(/[^.?!]+[.?!]/g)?.map(line => line.trim()) || []
  } else {
    lines = splitPoemWithoutPunctuation(poemContent)
  }

  const slidesLength: number = Math.ceil(lines.length / 2)
  const slides: number[] = Array.from({ length: slidesLength }, (_, index) => index)

  // thêm \n
  const result: string[][] = []
  for (let i = 0; i < lines.length; i += 2) {
    const l1 = insertNewlineAfterWordIndex(lines[i], 6)
    const l2 = lines[i + 1] ? insertNewlineAfterWordIndex(lines[i + 1], 6) : ''
    result.push([l1, l2])
  }

  return {
    lines,
    slidesLength,
    slides,
    result
  }
}
