'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { useMode } from '@/hooks/use-mode'
import { formatBRL } from '@/lib/utils'
import { cn } from '@/lib/utils'

const priceSizeVariants = cva('font-mono font-semibold text-text-primary', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-lg',
      lg: 'text-2xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface PriceDisplayProps extends VariantProps<typeof priceSizeVariants> {
  priceB2C: number
  priceB2B: number
  className?: string
}

function PriceDisplay({ priceB2C, priceB2B, size, className }: PriceDisplayProps) {
  const { mode } = useMode()
  const isB2B = mode === 'b2b'
  const price = isB2B ? priceB2B : priceB2C

  return (
    <div className={cn('flex flex-col', className)}>
      <span className={cn(priceSizeVariants({ size }))}>
        {formatBRL(price)}
      </span>
      {isB2B && (
        <span className="text-xs text-text-muted font-body">por unidade</span>
      )}
    </div>
  )
}

export { PriceDisplay }
