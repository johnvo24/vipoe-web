import clsx from 'clsx'

import UserAvatar from '@/components/ui/avatar'
import Link from 'next/link'
import Image from 'next/image'
import InteractionBox from '@/components/post/InteractionBox'
import { splitByNewLine, timeAgo } from '@/lib/utils'
import { Globe, GlobeLock } from 'lucide-react'
import { Poem } from '@/types/poem'

export function PostShareCard({
  poem,
  theme = 'light',
}: {
  poem: Poem
  theme?: 'light' | 'dark'
}) {
  const isDark = theme === 'dark'
  const lines = splitByNewLine(poem.content)

  return (
    <div
      className={clsx(
        'w-auto rounded-2xl p-4',
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      )}
    >
      {/* Header */}
      <div className="flex gap-3">
        <UserAvatar
          id={'post-avatar'}
          className={"w-10 h-10 cursor-pointer"}
          src={poem.avt_url}
          alt={poem.user_name}
          fallbackText={poem.user_name.charAt(0).toUpperCase() || "U"}
        />
        <div className="info-text flex-1">
          <div className="flex items-center">
            <span className="username text-15px font-semibold flex items-center">
              {poem.user_name}
            </span>
            <span className="mx-2 text-gray-400 text-sm">·</span>
            <span className="time text-sm">{timeAgo(poem.created_at)}</span>
            {poem.is_public
              ? <Globe size={16} className="ml-2" />
              : <GlobeLock size={16} className="ml-2" />
            }
          </div>
          <div className="post-description">
            <p className="note text-15px leading-[1.3]">{poem.note}</p>
            <div className="tags leading-[1]">
              {poem.tags && poem.tags.map(tag => (
                <Link
                  key={tag.id}
                  className="text-sm font-semibold me-1"
                  href={{
                    pathname: '/search',
                    query: { tags: '#' + tag.name }
                  }}
                >#{tag.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-[264px] h-[176px] sm:w-[480px] sm:h-[320px] mt-1 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={poem.image_url || "/images/bg-stmpt.jpg"}
          alt={`${poem.title}`}
          fill
          loading="lazy"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/15 flex flex-col justify-center items-center p-3">
          <h3 className="font-bold text-base mb-2 text-center truncate">
            {poem.title}
          </h3>
          <p className="text-sm text-gray-700 text-center overflow-hidden">
            {lines.map((line, index) => (
              <p
                key={index}
                className="text-gray-800 leading-relaxed text-center"
              >
                {line}
              </p>
            ))}
          </p>
        </div>
      </div>

      <InteractionBox
        editMode={false}
        isLiked={poem.is_liked}
        isSaved={poem.is_saved}
        likeCount={poem.like_count}
        commentCount={poem.comment_count}
        saveCount={poem.save_count}
        isMargin={false}
      />

      {/* Footer */}
      <div className="mt-6 text-xs opacity-60">
        vipoe
      </div>
    </div>
  )
}
