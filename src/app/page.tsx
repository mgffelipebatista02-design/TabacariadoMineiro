import { HeroSection } from '@/components/home/hero-section'
import { DualModeSection } from '@/components/home/dual-mode-section'
import { CategoriesGrid } from '@/components/home/categories-grid'
import { ComplianceSection } from '@/components/home/compliance-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DualModeSection />
      <CategoriesGrid />
      <ComplianceSection />
    </>
  )
}
