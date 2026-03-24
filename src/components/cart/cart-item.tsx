'use client'

import { Trash2 } from 'lucide-react'
import { cn, formatBRL } from '@/lib/utils'
import { QuantitySelector } from '@/components/ui/quantity-selector'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
  onRemove: (productId: string, variationId?: string) => void
  onUpdateQuantity: (productId: string, quantity: number, variationId?: string) => void
}

export function CartItemRow({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const lineTotal = item.price * item.quantity

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border-default last:border-b-0">
      {/* Image placeholder */}
      <div className="h-20 w-20 shrink-0 rounded-[--radius-md] bg-bg-elevated flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover rounded-[--radius-md]"
          />
        ) : (
          <span className="text-xs text-text-muted">Imagem</span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <h3 className="text-sm font-medium text-text-primary truncate">{item.name}</h3>
        <span className="text-xs text-text-muted">{item.unit}</span>

        <div className="flex items-center gap-3 mt-1">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => onUpdateQuantity(item.productId, qty, item.variationId)}
            min={1}
            max={99}
          />
        </div>
      </div>

      {/* Price and remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="font-mono text-sm font-semibold text-text-primary">
          {formatBRL(lineTotal)}
        </span>
        <button
          type="button"
          onClick={() => onRemove(item.productId, item.variationId)}
          className="flex items-center justify-center h-8 w-8 rounded-[--radius-md] text-text-muted hover:text-status-error hover:bg-bg-elevated transition-colors duration-200"
          aria-label="Remover item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
