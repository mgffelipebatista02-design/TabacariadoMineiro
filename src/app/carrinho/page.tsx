'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { SHIPPING_OPTIONS } from '@/lib/constants'
import { cn, formatBRL } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { CartItemRow } from '@/components/cart/cart-item'
import { CartSummary } from '@/components/cart/cart-summary'
import { DiscountBar } from '@/components/cart/discount-bar'

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, subtotal, setShipping } = useCart()
  const [cep, setCep] = useState('')
  const [shippingOptions, setShippingOptions] = useState<typeof SHIPPING_OPTIONS | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null)
  const [loadingCep, setLoadingCep] = useState(false)

  const handleCalcShipping = () => {
    if (cep.replace(/\D/g, '').length < 8) return
    setLoadingCep(true)
    // Mock: always returns SHIPPING_OPTIONS
    setTimeout(() => {
      setShippingOptions(SHIPPING_OPTIONS)
      setLoadingCep(false)
    }, 600)
  }

  const handleSelectShipping = (optionId: string) => {
    setSelectedShipping(optionId)
    const option = SHIPPING_OPTIONS.find((o) => o.id === optionId)
    if (option) {
      setShipping(option.price)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-elevated">
          <ShoppingBag className="h-10 w-10 text-text-muted" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-semibold text-text-primary">
            Carrinho vazio
          </h1>
          <p className="text-sm text-text-secondary">
            Nenhum item adicionado ao carrinho.
          </p>
        </div>
        <Link href="/catalogo">
          <Button variant="primary" size="lg">
            Explorar catálogo
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-text-primary mb-6">Carrinho</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: items */}
        <div className="flex-1 space-y-6">
          {/* Discount bar */}
          <Card padding="md">
            <DiscountBar subtotal={subtotal} />
          </Card>

          {/* Cart items */}
          <Card padding="md">
            {items.map((item) => (
              <CartItemRow
                key={`${item.productId}-${item.variationId ?? ''}`}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </Card>

          {/* Shipping calculator */}
          <Card padding="md" className="space-y-4">
            <h2 className="font-display text-base font-semibold text-text-primary">
              Calcular Frete
            </h2>
            <div className="flex gap-3">
              <Input
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="max-w-[180px]"
              />
              <Button
                variant="secondary"
                onClick={handleCalcShipping}
                loading={loadingCep}
              >
                Calcular
              </Button>
            </div>

            {/* Shipping options */}
            {shippingOptions && (
              <div className="space-y-2 pt-2">
                {shippingOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectShipping(option.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-[--radius-lg] border p-3 transition-colors duration-200',
                      selectedShipping === option.id
                        ? 'border-accent-amber bg-accent-amber/5'
                        : 'border-border-default hover:border-border-hover bg-bg-input'
                    )}
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-sm font-medium text-text-primary">
                        {option.name}
                      </span>
                      <span className="text-xs text-text-muted">{option.days}</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-text-primary">
                      {formatBRL(option.price)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right sidebar: summary */}
        <div className="w-full lg:w-[360px] shrink-0">
          <div className="lg:sticky lg:top-24">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
