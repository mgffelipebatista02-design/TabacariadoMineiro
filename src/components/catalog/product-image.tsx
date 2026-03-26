'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

const categoryColors: Record<string, string> = {
  'Essências': 'from-emerald-100 to-green-200',
  'Sedas': 'from-amber-100 to-yellow-200',
  'Isqueiros': 'from-orange-100 to-red-200',
  'Narguilé': 'from-teal-100 to-cyan-200',
  'Acessórios': 'from-violet-100 to-purple-200',
  'Tabaco': 'from-lime-100 to-emerald-200',
}

interface ProductImageProps {
  src: string
  alt: string
  category?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProductImage({
  src,
  alt,
  category,
  size = 'md',
  className,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false)

  const gradient = category ? categoryColors[category] ?? 'from-gray-100 to-gray-200' : 'from-gray-100 to-gray-200'

  const iconSize = size === 'lg' ? 'h-20 w-20' : size === 'md' ? 'h-12 w-12' : 'h-8 w-8'
  const textSize = size === 'lg' ? 'text-sm' : size === 'md' ? 'text-xs' : 'text-[10px]'

  if (hasError || !src) {
    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br',
          gradient,
          className
        )}
      >
        <Package className={cn(iconSize, 'text-text-muted/60')} />
        {size !== 'sm' && (
          <span className={cn(textSize, 'max-w-[80%] text-center font-body text-text-muted/80 line-clamp-2')}>
            {alt}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative h-full w-full', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={
          size === 'lg'
            ? '(max-width: 1024px) 100vw, 50vw'
            : size === 'md'
              ? '(max-width: 768px) 50vw, 25vw'
              : '80px'
        }
        onError={() => setHasError(true)}
      />
    </div>
  )
}
