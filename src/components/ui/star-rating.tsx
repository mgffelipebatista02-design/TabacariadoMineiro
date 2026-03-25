'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const starSizeVariants = cva('', {
  variants: {
    size: {
      sm: 'h-3.5 w-3.5',
      md: 'h-5 w-5',
      lg: 'h-7 w-7',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface StarRatingProps extends VariantProps<typeof starSizeVariants> {
  value: number
  onChange?: (value: number) => void
  max?: number
  className?: string
}

function StarRating({ value, onChange, max = 5, size, className }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const isInteractive = !!onChange

  const displayValue = hoverValue ?? value

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1
        const isFilled = starIndex <= displayValue

        return (
          <button
            key={i}
            type="button"
            disabled={!isInteractive}
            className={cn(
              'transition-colors duration-150 disabled:cursor-default',
              isInteractive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            onClick={() => onChange?.(starIndex)}
            onMouseEnter={() => isInteractive && setHoverValue(starIndex)}
            onMouseLeave={() => isInteractive && setHoverValue(null)}
            aria-label={`${starIndex} estrela${starIndex > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                starSizeVariants({ size }),
                isFilled
                  ? 'fill-accent-green text-accent-green'
                  : 'fill-transparent text-text-muted'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export { StarRating }
