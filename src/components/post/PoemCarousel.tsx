'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Poem } from '@/types/poem'
import Image from 'next/image'

interface PoemCarouselProps {
  poemData: Poem
}

const PoemCarousel: React.FC<PoemCarouselProps> = ({ poemData }) => {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    dragFree: false,
    containScroll: 'trimSnaps',
  })

  // For now, showing multiple slides with same content
  const slides = Array.from({ length: 3 }, (_, index) => index)

  return (
    <div className="poem-box scrollbar-hidden overflow-hidden ps-14 pe-[22px] select-none" ref={emblaRef}>
      <div className="poem-content flex gap-2">
        {slides.map((slideIndex) => (
          <div
            key={slideIndex}
            className="relative w-[264px] h-[176px] sm:w-[480px] sm:h-[320px] rounded-lg overflow-hidden flex-shrink-0 vi-border"
          >
            <Image
              src={poemData.image_url || "/images/bg-stmpt.jpg"}
              alt={`${poemData.title} - Slide ${slideIndex + 1}`}
              fill
              loading="lazy"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-white/15 flex flex-col justify-center items-center p-3 z-10">
              <h3 className="font-bold text-base mb-2 text-center truncate">
                {poemData.title}
              </h3>
              <p className="text-sm text-gray-700 text-center whitespace-pre-wrap overflow-hidden line-clamp-4">
                {poemData.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PoemCarousel