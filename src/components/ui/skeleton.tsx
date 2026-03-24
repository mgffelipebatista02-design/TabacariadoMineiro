'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const skeletonVariants = cva('animate-shimmer', {
  variants: {
    rounded: {
      sm: 'rounded-[--radius-sm]',
      md: 'rounded-[--radius-md]',
      lg: 'rounded-[--radius-lg]',
      xl: 'rounded-[--radius-xl]',
      pill: 'rounded-[--radius-pill]',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    rounded: 'md',
  },
})

export interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
  width?: string | number
  height?: string | number
  className?: string
}

function Skeleton({ width, height, rounded, className }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ rounded }), className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

export { Skeleton }
