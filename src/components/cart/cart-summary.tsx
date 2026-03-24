'use client'

import Link from 'next/link'
import { cn, formatBRL } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { useMode } from '@/hooks/use-mode'
import { DISCOUNT_TIERS, B2B_MIN_ORDER } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DiscountBar } from './discount-bar'

interface CartSummaryProps {
  condensed?: boolean
  className?: string
}

export function CartSummary({ condensed = false, className }: CartSummaryProps) {
  const { items, subtotal, discount, discountTier, shipping, total, b2bMinOrderMet } = useCart()
  const { mode } = useMode()

  const isEmpty = items.length === 0
  const canProceed = !isEmpty && b2bMinOrderMet

  const activeTierLabel = DISCOUNT_TIERS.find((t) => t.min === discountTier)?.label

  return (
    <Card padding="lg" className={cn('space-y-4', className)}>
      <h2 className="font-display text-lg font-semibold text-text-primary">Resumo</h2>

      {!condensed && <DiscountBar subtotal={subtotal} />}

      {/* Line items */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Subtotal</span>
          <span className="font-mono text-text-primary">{formatBRL(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary flex items-center gap-2">
              Desconto
              {activeTierLabel && (
                <Badge variant="amber" className="text-[0.625rem]">
                  {discountTier ? `${DISCOUNT_TIERS.find((t) => t.min === discountTier)?.discount! * 100}%` : ''}
                </Badge>
              )}
            </span>
            <span className="font-mono text-accent-amber">-{formatBRL(discount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Frete</span>
          <span className="font-mono text-text-primary">
            {shipping > 0 ? formatBRL(shipping) : 'A calcular'}
          </span>
        </div>

        <div className="border-t border-border-default pt-3 flex items-center justify-between">
          <span className="font-display font-semibold text-text-primary">Total</span>
          <span className="font-mono text-lg font-bold text-text-primary">{formatBRL(total)}</span>
        </div>
      </div>

      {/* B2B minimum order warning */}
      {mode === 'b2b' && !b2bMinOrderMet && (
        <div className="rounded-[--radius-md] bg-status-error/10 border border-status-error/25 p-3">
          <p className="text-xs text-status-error">
            Pedido mínimo B2B: {formatBRL(B2B_MIN_ORDER)}. Faltam{' '}
            <span className="font-mono font-medium">
              {formatBRL(B2B_MIN_ORDER - subtotal)}
            </span>
          </p>
        </div>
      )}

      {/* Condensed: show item count */}
      {condensed && (
        <div className="space-y-2 border-t border-border-default pt-3">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variationId ?? ''}`} className="flex justify-between text-xs text-text-secondary">
              <span className="truncate mr-2">
                {item.quantity}x {item.name}
              </span>
              <span className="font-mono shrink-0">{formatBRL(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {!condensed && (
        <Link href="/checkout" className={cn(!canProceed && 'pointer-events-none')}>
          <Button
            fullWidth
            size="lg"
            disabled={!canProceed}
            className="mt-2"
          >
            Finalizar Pedido
          </Button>
        </Link>
      )}
    </Card>
  )
}
