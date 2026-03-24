'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Store, Building2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const cards = [
  {
    title: 'Varejo (B2C)',
    icon: Store,
    features: [
      'Precos unitarios',
      'Envio para todo Brasil',
      'Pagamento facilitado',
      'Programa de fidelidade',
    ],
    cta: 'Explorar Varejo',
    href: '/catalogo',
  },
  {
    title: 'Atacado (B2B)',
    icon: Building2,
    features: [
      'Precos por volume',
      'Pedido minimo R$500',
      'Condicoes especiais',
      'Nota fiscal garantida',
    ],
    cta: 'Conhecer Atacado',
    href: '/pedido-rapido',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
}

export function DualModeSection() {
  return (
    <section className="bg-bg-primary py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center font-display text-3xl font-bold text-text-primary md:text-4xl"
        >
          Dois modos, uma experiencia
        </motion.h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={cn(
                  'group flex flex-col rounded-[--radius-xl] border border-border-default bg-bg-card p-8',
                  'transition-colors hover:border-accent-amber'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[--radius-lg] bg-bg-elevated">
                    <Icon className="h-6 w-6 text-accent-amber" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-text-primary">
                    {card.title}
                  </h3>
                </div>

                <ul className="mt-8 flex-1 space-y-4">
                  {card.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-text-secondary">
                      <Check className="h-4 w-4 shrink-0 text-accent-amber" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={card.href}
                  className={cn(
                    'mt-8 inline-flex items-center justify-center rounded-[--radius-md] px-6 py-3',
                    'border border-border-default font-medium text-text-primary',
                    'transition-colors hover:border-accent-amber hover:text-accent-amber'
                  )}
                >
                  {card.cta}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
