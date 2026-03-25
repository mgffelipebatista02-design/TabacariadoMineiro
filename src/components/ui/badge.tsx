'use client'

import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-[--radius-pill] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        olive: 'bg-accent-green/15 text-accent-green border border-accent-green/25',
        green: 'bg-status-success/15 text-status-success border border-status-success/25',
        red: 'bg-status-error/15 text-status-error border border-status-error/25',
        blue: 'bg-status-info/15 text-status-info border border-status-info/25',
        gray: 'bg-bg-elevated text-text-secondary border border-border-default',
      },
    },
    defaultVariants: {
      variant: 'olive',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  )
}

export { Badge, badgeVariants }
