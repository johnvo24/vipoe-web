'use client'

import { useState } from 'react'
import Image from 'next/image'
import { splitByNewLine } from '@/lib/utils'
import { Poem } from '@/types/poem'
import { cn } from '@/lib/utils'
import { EmojiItem } from '@/types/poem'

export function PostShareCard({
  poem,
  theme = 'light',
  emojis,
  onEmojiMouseDown,
}: {
  poem: Poem
  theme?: 'light' | 'dark' | 'pink' | 'purple' | 'blue' | 'red'
  emojis: EmojiItem[],
  onEmojiMouseDown: (id: string) => void
}) {
  const isDark = theme === 'dark'
  const isPink = theme === 'pink'
  const isPurple = theme === 'purple'
  const isBlue = theme === 'blue'
  const isRed = theme === 'red'
  const lines = splitByNewLine(poem.content)

  const themeClass = isPink
    ? 'bg-pink-500 text-black'
    : isDark
      ? 'bg-black text-white'
      : isPurple
        ? 'bg-purple-500 text-black'
        : isBlue
          ? 'bg-blue-500 text-black'
          : isRed
            ? 'bg-red-500 text-black'
            : 'bg-white text-black'

  return (
    <div
      className={cn('w-auto rounded-2xl p-4', themeClass)}
    >
      <div className="relative w-[264px] h-[176px] sm:w-[480px] sm:h-[320px] rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={poem.image_url || "/images/bg-stmpt.jpg"}
          alt={`${poem.title}`}
          fill
          loading="lazy"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/15 flex flex-col justify-center items-center p-3">
          <h3 className="font-bold text-base mb-2 text-center truncate select-none">
            {poem.title}
          </h3>
          <span className="text-sm text-gray-700 text-center overflow-hidden select-none">
            {lines.map((line, index) => (
              <p
                key={index}
                className="text-gray-800 leading-relaxed text-center"
              >
                {line}
              </p>
            ))}
          </span>
        </div>
        {emojis.map((emoji) => (
          <div
            key={emoji.id}
            onMouseDown={() => onEmojiMouseDown(emoji.id)}
            className="absolute text-3xl cursor-grab active:cursor-grabbing"
            style={{
              left: emoji.x,
              top: emoji.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {emoji.symbol}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-xs opacity-60">
        vipoe @{poem.user_name}
      </div>
    </div>
  )
}
