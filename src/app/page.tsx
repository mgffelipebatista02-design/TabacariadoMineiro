'use client'

import { HeroSection } from '@/components/home/hero-section'
import { DualModeSection } from '@/components/home/dual-mode-section'
import { CategoriesGrid } from '@/components/home/categories-grid'
import { ComplianceSection } from '@/components/home/compliance-section'
import { BannerCarousel } from '@/components/home/banner-carousel'

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
