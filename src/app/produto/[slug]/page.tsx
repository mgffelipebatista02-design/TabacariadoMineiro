'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home, Package } from 'lucide-react'
import { ProductImage } from '@/components/catalog/product-image'
import { motion } from 'framer-motion'
import * as Tabs from '@radix-ui/react-tabs'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/navigation'

import { products } from '@/data/products'
import { categories } from '@/data/categories'
import { cn } from '@/lib/utils'
import { useMode } from '@/hooks/use-mode'
import { useCart } from '@/hooks/use-cart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/ui/price-display'
import { QuantitySelector } from '@/components/ui/quantity-selector'
import { StarRating } from '@/components/ui/star-rating'
import { ProductCard } from '@/components/catalog/product-card'

const mockReviews = [
  {
    id: 'rev-1',
    customerName: 'Carlos M.',
    rating: 5,
    comment: 'Excelente qualidade, chegou bem embalado e no prazo.',
    date: '2025-12-10',
  },
  {
    id: 'rev-2',
    customerName: 'Ana P.',
    rating: 4,
    comment: 'Produto muito bom, atendeu minhas expectativas.',
    date: '2025-11-22',
  },
  {
    id: 'rev-3',
    customerName: 'Roberto S.',
    rating: 5,
    comment: 'Já é a terceira vez que adquiro. Recomendo sem dúvida.',
    date: '2025-10-05',
  },
]

function stockBadge(stock: number) {
  if (stock > 10) return <Badge variant="green">Em estoque</Badge>
  if (stock >= 1) return <Badge variant="olive">Últimas unidades</Badge>
  return <Badge variant="red">Indisponível</Badge>
}

export default function ProdutoPage() {
  const params = useParams<{ slug: string }>()
  const { mode } = useMode()
  const { addItem } = useCart()
  const [mounted, setMounted] = useState(false)

  const product = useMemo(
    () => products.find((p) => p.slug === params.slug),
    [params.slug]
  )

  const isB2B = mode === 'b2b'
  const minQty = product ? (isB2B ? product.minQtyB2B : 1) : 1
  const [quantity, setQuantity] = useState(minQty)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

  // Mount guard — Swiper injects dynamic attributes that cause hydration mismatch
  useEffect(() => setMounted(true), [])


  const category = useMemo(
    () => categories.find((c) => c.name === product?.category),
    [product?.category]
  )

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [product])

  if (!product) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <Package className="mb-4 h-16 w-16 text-text-muted" />
        <h1 className="mb-2 text-2xl font-bold text-text-primary font-display">
          Produto não encontrado
        </h1>
        <p className="mb-6 text-text-secondary font-body">
          O produto que você procura não existe ou foi removido.
        </p>
        <Link href="/catalogo">
          <Button variant="secondary">Explorar catálogo</Button>
        </Link>
      </main>
    )
  }

  const price = isB2B ? product.priceB2B : product.priceB2C
  const unit = isB2B ? product.unitB2B : product.unitB2C
  const outOfStock = product.stock === 0

  // Build image placeholders (use product.images length or default to 4)
  const imageCount = Math.max(product.images.length, 4)
  const imageSlides = Array.from({ length: imageCount }, (_, i) => i)

  function handleAdd() {
    if (outOfStock) return
    addItem({
      productId: product!.id,
      quantity,
      name: product!.name,
      price,
      image: product!.images[0] ?? '',
      unit,
    })
  }

  const tabTriggerClass = (value: string) =>
    cn(
      'px-4 py-2.5 text-sm font-medium font-body transition-colors',
      'border-b-2 border-transparent data-[state=active]:border-accent-green data-[state=active]:text-accent-green',
      'text-text-secondary hover:text-text-primary'
    )

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-text-muted font-body"
      >
        <Link
          href="/"
          className="flex items-center gap-1 transition-colors hover:text-text-primary"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href="/catalogo"
          className="transition-colors hover:text-text-primary"
        >
          Catálogo
        </Link>
        {category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href={`/catalogo/${category.slug}`}
              className="transition-colors hover:text-text-primary"
            >
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">{product.name}</span>
      </nav>

      {/* Product detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-8 lg:grid-cols-2"
      >
        {/* Left: Gallery */}
        <div className="flex flex-col gap-3">
          {mounted ? (
            <>
              <Swiper
                modules={[Thumbs, Navigation]}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                navigation
                className="aspect-square w-full overflow-hidden rounded-[--radius-xl] border border-border-default bg-bg-elevated"
              >
                {imageSlides.map((i) => (
                  <SwiperSlide key={i}>
                    <ProductImage
                      src={product.images[i] ?? product.images[0] ?? ''}
                      alt={`${product.name} - imagem ${i + 1}`}
                      category={product.category}
                      size="lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                slidesPerView={4}
                spaceBetween={8}
                watchSlidesProgress
                className="w-full"
              >
                {imageSlides.map((i) => (
                  <SwiperSlide key={i}>
                    <div className="aspect-square cursor-pointer overflow-hidden rounded-[--radius-md] border border-border-default bg-bg-elevated transition-colors hover:border-accent-green">
                      <ProductImage
                        src={product.images[i] ?? product.images[0] ?? ''}
                        alt={`${product.name} - miniatura ${i + 1}`}
                        category={product.category}
                        size="sm"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <div className="aspect-square w-full rounded-[--radius-xl] border border-border-default bg-bg-elevated animate-pulse" />
          )}
        </div>

        {/* Right: Product info */}
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-sm text-text-muted font-body">
              {product.brand}
            </span>
            <h1 className="mt-1 text-2xl font-bold text-text-primary font-display lg:text-3xl">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StarRating value={product.rating} size="sm" />
            <span className="text-sm text-text-muted font-body">
              ({product.reviewCount} avaliações)
            </span>
          </div>

          <div>{stockBadge(product.stock)}</div>

          <PriceDisplay
            priceB2C={product.priceB2C}
            priceB2B={product.priceB2B}
            size="lg"
          />

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-text-secondary font-body">
                Quantidade
              </label>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={minQty}
                max={product.stock || 1}
                unit={unit}
              />
            </div>
            <Button
              size="lg"
              disabled={outOfStock}
              onClick={handleAdd}
              className="flex-1 sm:flex-none sm:min-w-[180px]"
            >
              Adicionar
            </Button>
          </div>

          {isB2B && (
            <p className="text-xs text-text-muted font-body">
              Quantidade mínima: {product.minQtyB2B} {product.unitB2B}(s)
            </p>
          )}

          {/* Descrição visível */}
          <div className="mt-4 rounded-[--radius-lg] border border-border-default bg-bg-elevated p-4">
            <h2 className="mb-2 text-sm font-semibold text-text-primary font-display">
              Descrição
            </h2>
            <p className="text-sm text-text-secondary font-body leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs.Root defaultValue="descricao" className="mt-12">
        <Tabs.List className="flex border-b border-border-default">
          <Tabs.Trigger value="descricao" className={tabTriggerClass('descricao')}>
            Descrição
          </Tabs.Trigger>
          <Tabs.Trigger value="especificacoes" className={tabTriggerClass('especificacoes')}>
            Especificações
          </Tabs.Trigger>
          <Tabs.Trigger value="avaliacoes" className={tabTriggerClass('avaliacoes')}>
            Avaliações
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="descricao" className="py-6">
          <p className="max-w-prose text-text-secondary font-body leading-relaxed">
            {product.description}
          </p>
        </Tabs.Content>

        <Tabs.Content value="especificacoes" className="py-6">
          <div className="overflow-hidden rounded-[--radius-lg] border border-border-default">
            <table className="w-full text-sm font-body">
              <tbody>
                {Object.entries(product.specifications).map(
                  ([key, value], idx) => (
                    <tr
                      key={key}
                      className={cn(
                        'border-b border-border-default last:border-0',
                        idx % 2 === 0 ? 'bg-bg-card' : 'bg-bg-elevated'
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-text-primary">
                        {key}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {value}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        <Tabs.Content value="avaliacoes" className="py-6">
          <div className="space-y-6">
            {mockReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-[--radius-lg] border border-border-default bg-bg-card p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text-primary font-body">
                      {review.customerName}
                    </span>
                    <StarRating value={review.rating} size="sm" />
                  </div>
                  <span className="text-xs text-text-muted font-body">
                    {new Date(review.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="text-sm text-text-secondary font-body">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-text-primary font-display">
            Produtos relacionados
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
