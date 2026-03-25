'use client'

import { cn, formatBRL } from '@/lib/utils'
import { DISCOUNT_TIERS } from '@/lib/constants'

interface DiscountBarProps {
  subtotal: number
  className?: string
}

export function DiscountBar({ subtotal, className }: DiscountBarProps) {
  const maxTier = DISCOUNT_TIERS[DISCOUNT_TIERS.length - 1].min
  const progress = Math.min((subtotal / maxTier) * 100, 100)

  // Find next tier
  const nextTier = DISCOUNT_TIERS.find((t) => subtotal < t.min)
  const remaining = nextTier ? nextTier.min - subtotal : 0
  const nextDiscount = nextTier ? nextTier.discount * 100 : 0

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress bar */}
      <div className="relative h-2 w-full rounded-[--radius-pill] bg-bg-elevated overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-[--radius-pill] bg-accent-green transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Tier markers */}
      <div className="relative flex justify-between text-xs">
        {DISCOUNT_TIERS.map((tier) => {
          const position = (tier.min / maxTier) * 100
          const isActive = subtotal >= tier.min

          return (
            <div
              key={tier.min}
              className="flex flex-col items-center"
              style={{ position: 'absolute', left: `${position}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className={cn(
                  'h-3 w-3 rounded-full border-2 transition-colors duration-200',
                  isActive
                    ? 'border-accent-green bg-accent-green'
                    : 'border-border-default bg-bg-card'
                )}
              />
              <span
                className={cn(
                  'mt-1 font-mono whitespace-nowrap',
                  isActive ? 'text-accent-green font-medium' : 'text-text-muted'
                )}
              >
                {formatBRL(tier.min)}
              </span>
              <span
                className={cn(
                  'whitespace-nowrap',
                  isActive ? 'text-accent-green' : 'text-text-muted'
                )}
              >
                {tier.discount * 100}%
              </span>
            </div>
          )
        })}
      </div>

      {/* Next tier message */}
      {nextTier && (
        <p className="text-xs text-text-secondary mt-6 pt-2">
          Faltam{' '}
          <span className="font-mono font-medium text-accent-green">
            {formatBRL(remaining)}
          </span>{' '}
          para {nextDiscount}% de desconto
        </p>
      )}
      {!nextTier && subtotal > 0 && (
        <p className="text-xs text-accent-green mt-6 pt-2 font-medium">
          Desconto máximo atingido
        </p>
      )}
    </div>
  )
}
