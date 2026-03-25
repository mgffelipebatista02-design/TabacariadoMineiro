'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/80 to-transparent" />

      {/* Noise overlay */}
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0 }}
        >
          <span
            className={cn(
              'inline-block rounded-[--radius-pill] border border-accent-green/40 px-4 py-1.5',
              'text-sm font-medium text-accent-green'
            )}
          >
            Varejo & Atacado
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 font-display text-5xl font-bold tracking-tight text-text-primary md:text-7xl"
        >
          Tabacaria do{' '}
          <span className="text-accent-green">Mineiro</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary"
        >
          Produtos selecionados para conhecedores. Atendimento especializado
          para varejo e atacado.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/catalogo"
            className={cn(
              'inline-flex items-center justify-center rounded-[--radius-md] px-8 py-3',
              'bg-accent-green text-bg-primary font-medium',
              'transition-colors hover:bg-accent-green-light'
            )}
          >
            Explorar Catalogo
          </Link>
          <Link
            href="/pedido-rapido"
            className={cn(
              'inline-flex items-center justify-center rounded-[--radius-md] px-8 py-3',
              'border border-border-default text-text-primary font-medium',
              'transition-colors hover:border-accent-green hover:text-accent-green'
            )}
          >
            Pedido Rapido B2B
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
