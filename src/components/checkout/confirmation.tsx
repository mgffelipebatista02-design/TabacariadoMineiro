'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { formatBRL, generateOrderNumber } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function Confirmation() {
  const { items, total } = useCart()

  const orderNumber = useMemo(() => generateOrderNumber(), [])

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Success icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-amber/10">
        <CheckCircle className="h-12 w-12 text-accent-amber" />
      </div>

      <div className="text-center space-y-1">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          Pedido Realizado
        </h2>
        <p className="text-sm text-text-secondary">
          Número do pedido:{' '}
          <span className="font-mono font-medium text-text-primary">{orderNumber}</span>
        </p>
      </div>

      {/* Order summary */}
      <Card padding="md" className="w-full max-w-md space-y-3">
        <h3 className="text-sm font-medium text-text-secondary">Resumo do Pedido</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variationId ?? ''}`}
              className="flex justify-between text-sm"
            >
              <span className="text-text-secondary truncate mr-2">
                {item.quantity}x {item.name}
              </span>
              <span className="font-mono text-text-primary shrink-0">
                {formatBRL(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-border-default pt-2 flex justify-between">
          <span className="font-display font-semibold text-text-primary">Total</span>
          <span className="font-mono font-bold text-text-primary">{formatBRL(total)}</span>
        </div>
      </Card>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Link href={`/rastreio/${orderNumber}`} className="flex-1">
          <Button variant="primary" size="lg" fullWidth>
            Acompanhar Pedido
          </Button>
        </Link>
        <Link href="/catalogo" className="flex-1">
          <Button variant="secondary" size="lg" fullWidth>
            Continuar Explorando
          </Button>
        </Link>
      </div>
    </div>
  )
}
