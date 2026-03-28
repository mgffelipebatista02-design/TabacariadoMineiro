'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { banners } from '@/data/banners'
import { cn } from '@/lib/utils'

export function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Render placeholder on server and first client render to avoid hydration mismatch
  // (Swiper injects dynamic attributes that differ between server and client)
  if (!mounted) {
    return (
      <section className="relative pt-[72px]">
        <div className="aspect-[16/9] md:aspect-[21/9] w-full bg-bg-elevated animate-shimmer" />
      </section>
    )
  }

  return (
    <section className="relative pt-[72px]">
      <div className="banner-carousel relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            prevEl: '.banner-prev',
            nextEl: '.banner-next',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          loop
          onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
          className="w-full"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div
                className={cn(
                  'relative flex items-end aspect-[16/9] md:aspect-[21/9] w-full bg-gradient-to-r',
                  banner.gradient
                )}
              >
                {/* Dark overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Text content */}
                <div className="relative z-10 w-full px-6 pb-12 md:px-12 md:pb-16 lg:px-16 lg:pb-20">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={banner.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.4 }}
                      className="max-w-2xl"
                    >
                      <h2 className="font-display text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                        {banner.title}
                      </h2>
                      <p className="mt-2 text-sm text-white/80 font-body md:text-base lg:mt-3">
                        {banner.subtitle}
                      </p>
                      <Link
                        href={banner.link}
                        className={cn(
                          'mt-4 inline-flex items-center justify-center rounded-[--radius-md] px-6 py-2.5',
                          'bg-accent-green text-white font-medium text-sm',
                          'transition-colors hover:bg-accent-green-light',
                          'lg:mt-5 lg:px-8 lg:py-3 lg:text-base'
                        )}
                      >
                        {banner.ctaLabel}
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom navigation arrows */}
        <button
          className={cn(
            'banner-prev absolute left-3 top-1/2 z-10 -translate-y-1/2',
            'flex h-10 w-10 items-center justify-center rounded-full',
            'bg-white/80 backdrop-blur-sm text-text-primary',
            'transition-colors hover:bg-white',
            'md:left-4 md:h-12 md:w-12'
          )}
          aria-label="Banner anterior"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <button
          className={cn(
            'banner-next absolute right-3 top-1/2 z-10 -translate-y-1/2',
            'flex h-10 w-10 items-center justify-center rounded-full',
            'bg-white/80 backdrop-blur-sm text-text-primary',
            'transition-colors hover:bg-white',
            'md:right-4 md:h-12 md:w-12'
          )}
          aria-label="Próximo banner"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </section>
  )
}
