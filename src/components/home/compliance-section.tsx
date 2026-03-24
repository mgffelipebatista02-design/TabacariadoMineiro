'use client'

import { motion } from 'framer-motion'
import { Shield, FileText, Lock, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  {
    icon: Shield,
    title: 'ANVISA',
    description: 'Conformidade regulatoria com as normas vigentes',
  },
  {
    icon: FileText,
    title: 'Sefaz',
    description: 'Nota fiscal eletronica em todas as operacoes',
  },
  {
    icon: Lock,
    title: 'Pagamento Seguro',
    description: 'Gateway de pagamento certificado PCI-DSS',
  },
  {
    icon: Truck,
    title: 'Logistica',
    description: 'Envio rastreado para todo o Brasil',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
}

export function ComplianceSection() {
  return (
    <section className="bg-bg-primary py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center font-display text-3xl font-bold text-text-primary md:text-4xl"
        >
          Compromisso e Conformidade
        </motion.h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  'flex flex-col items-center rounded-[--radius-xl] border border-border-default bg-bg-card p-8 text-center',
                  'transition-colors hover:border-border-hover'
                )}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-[--radius-lg] bg-bg-elevated">
                  <Icon className="h-7 w-7 text-accent-amber" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
