'use client'

import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/home/hero-section'
import { DualModeSection } from '@/components/home/dual-mode-section'
import { CategoriesGrid } from '@/components/home/categories-grid'
import { ComplianceSection } from '@/components/home/compliance-section'

const BannerCarousel = dynamic(
  () => import('@/components/home/banner-carousel').then((mod) => mod.BannerCarousel),
  {
    ssr: false,
    loading: () => (
      <div className="pt-[72px]">
        <div className="aspect-[16/9] md:aspect-[21/9] w-full bg-bg-elevated animate-shimmer" />
      </div>
    ),
  }
)

export default function HomePage() {
  return (
    <>
      <BannerCarousel />
      <HeroSection />
      <DualModeSection />
      <CategoriesGrid />
      <ComplianceSection />
    </>
  )
}
