'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  unit?: string
  className?: string
}

function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  unit,
  className,
}: QuantitySelectorProps) {
  const canDecrement = value > min
  const canIncrement = value < max

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0 rounded-[--radius-md] border border-border-default bg-bg-input',
        className
      )}
    >
      <button
        type="button"
        onClick={() => canDecrement && onChange(value - 1)}
        disabled={!canDecrement}
        className="flex h-8 w-8 items-center justify-center text-text-secondary transition-colors hover:text-text-primary hover:bg-bg-elevated disabled:opacity-40 disabled:cursor-not-allowed rounded-l-[--radius-md]"
        aria-label="Diminuir quantidade"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span className="flex h-8 min-w-[2.5rem] items-center justify-center border-x border-border-default text-sm font-medium text-text-primary tabular-nums">
        {value}
        {unit && <span className="ml-0.5 text-xs text-text-muted">{unit}</span>}
      </span>

      <button
        type="button"
        onClick={() => canIncrement && onChange(value + 1)}
        disabled={!canIncrement}
        className="flex h-8 w-8 items-center justify-center text-text-secondary transition-colors hover:text-text-primary hover:bg-bg-elevated disabled:opacity-40 disabled:cursor-not-allowed rounded-r-[--radius-md]"
        aria-label="Aumentar quantidade"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export { QuantitySelector }
