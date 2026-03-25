'use client'

import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

function Pill({ className, active = false, children, ...props }: PillProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center rounded-[--radius-pill] px-4 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green',
        active
          ? 'bg-accent-green text-bg-primary'
          : 'bg-bg-card border border-border-default text-text-secondary hover:border-border-hover hover:text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { Pill }
